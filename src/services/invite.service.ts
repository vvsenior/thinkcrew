import { Types } from 'mongoose'

import * as crudService from '../services/crud.service'
import * as emailService from '../services/email.service'
import * as rootService from '../services/root.service'
import { IUser, User } from '../models/user.model'
import { Person, IPerson } from '../models/person.model'
import { Invite, IInvite } from '../models/invite.model'
import { IInviteProject, InviteProject } from '../models/inviteproject.model'
import { IPermission, Permission } from '../models/permission.model'
import { Project, IProject } from '../models/project.model'
import HttpException from '../common/http-exception'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"
i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })
export type UserProject = {
  _id: string;
  firstname: string;
  email: string;
  projectNames: string[];
  permissions: IPermission[];
}

export async function handleInviteUserByEmail(email: string, userFromId: Types.ObjectId, projectId: Types.ObjectId) {
  // validate
  rootService.validateEmail(email)
  const existingUser = await User.findOne({ email })
  const person = await crudService.readByObj<IPerson>(Person, {userId: userFromId})
  const project = await crudService.read<IProject>(Project, projectId)
  if(existingUser) {

    // handle existing user
    const existingPerson = await Person.findOne({ userId: existingUser._id })
    if(!existingPerson) throw new HttpException(400, i18next.t('user_exists_but_no_person_record_found'))
    const permission = await crudService.create<IPermission>(Permission, { userId: existingUser._id, documentId: projectId, valueType: 'project', level: 'view' })
    let locale = "en"
    emailService.emailNotify(
      existingPerson.firstname!, 
      existingUser.email, 
      `${person._fullname} has invited you to join the project ${project.name}. You have automatically been added to the project.`,
      locale
    )

    // TODO: socket - send permission existing user
    // TODO: socket - send alerts to both users

  } else {

    // find or create invite
    const invite = await crudService.updateByObj<IInvite>(Invite, { email }, { email }, true) // find or create

    // find or create inviteProject
    await crudService.updateByObj<IInviteProject>(InviteProject, { userFromId, projectId, inviteId: invite._id }, { userFromId, projectId, inviteId: invite._id }, true) // find or create
    const locale = "en"
    emailService.emailInvite(person._fullname, email, invite.code, project.name, locale)
  }
}

export async function joinInvitedProjects(user: IUser, invite: IInvite) {

  // join any invited projects
  const inviteProjects = await crudService.readManyByObj<IInviteProject>(InviteProject, { inviteId: invite._id })
  const userProjects: UserProject[] = []
  inviteProjects.forEach(async (inviteProject: IInviteProject) => {
    const fromUser = await User.findById(inviteProject.userFromId)
    const fromPerson = await Person.findOne({ userId: inviteProject.userFromId })
    const project = await Project.findById(inviteProject.projectId)
    if(!fromUser || !fromPerson || !project) return

    // create permission
    const permission = await crudService.create<IPermission>(Permission, { userId: user._id, documentId: project._id, valueType: 'project', level: 'view' })

    // create userProject
    const index = userProjects.findIndex((userProject: UserProject) => userProject._id === fromUser._id.toString())
    if(index === -1) {
      userProjects.push({
        _id: fromUser._id.toString(),
        firstname: fromPerson.firstname!,
        email: fromUser.email,
        projectNames: [project.name],
        permissions: [permission]
      })
    } else {
      userProjects[index].projectNames.push(project.name)
    }

  })
  return userProjects
}