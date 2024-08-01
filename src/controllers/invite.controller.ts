import { NextFunction, Request, Response } from 'express'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"

import * as crudService from '../services/crud.service'
import * as userService from '../services/user.service'
import * as inviteService from '../services/invite.service'
import * as emailService from '../services/email.service'
import { Invite, IInvite } from '../models/invite.model'
import { getValueFromHeaders } from '../common/getValueFromHeaders'
import { createObjectId } from '../common/createObjectId'

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const emails: string[] = req.body
    if(!emails) throw new Error(i18next.t('missing_required_fields'))
    const headerId = getValueFromHeaders(req.headers, 'X-Project')
    const projectId = createObjectId(headerId)
    const userFromId = createObjectId(req.userId)
    
    // create invites for each email address
    emails.forEach(async (emailRaw: string) => {
      inviteService.handleInviteUserByEmail(emailRaw.toLowerCase(), userFromId, projectId)
    })

    res
      .sendStatus(201)
  } catch(e) {
    next(e)
  }
}

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = req.params.code
    // get invite by code
    const invite = await crudService.readByObj<IInvite>(Invite, { code })

    res
      .status(200)
      .json(invite)
  } catch(e) {
    next(e)
  }
}

export const join = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = req.params.code
    // get invite by code
    const invite = await crudService.readByObj<IInvite>(Invite, { code })

    // create new account
    const { user, person } = await userService.join(req.body)

    // join any invited projects, get an array of users to notify that someone just joined thier projects
    const userProjects = await inviteService.joinInvitedProjects(user, invite)

    // send welcome email
    const locale = user.language || "en"
    emailService.emailWelcome(person.firstname!, user.email, locale)

    // notify sending users
    userProjects.forEach(async (userProject: inviteService.UserProject) => {
      // set default language en because language property not define for userProject
      let locale = "en" // userProject.language || "en"
      emailService.emailNotify(
        userProject.firstname!, 
        userProject.email, 
        `Your invite to ${person.firstname} ${person.lastname} (${user.email}) to join ${userProject.projectNames.join(', ')} has been accepted.`,
        locale
      )
    })

    // TODO: socket - send permissions to existing users
    // TODO: socket - send alerts to inviting users

    res
      .sendStatus(201)
  } catch(e) {
    next(e)
  }
}
