import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"

import { sendMail } from '../common/sendMail'

const getYear = () => new Date().getFullYear().toString()

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })

export const emailRegister = async (firstname: string, to: string, code: string, locale?: string) => {
  let locales = {}
  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        hi: t("hi"),
        registration_html_message1: t("registration_html_message1"),
        registration_html_message2: t("registration_html_message2"),
        registration_html_message3: t("registration_html_message3"),
        registration_html_message4: t("registration_html_message4")
      }
    })

  const subject = 'Think Crew Registration'
  sendMail({
    to,
    subject,
    template: 'registration',
    context: { firstname, subject, url: `https://thinkcrew.com/register?${code}`, year: getYear(), ...locales }
  })
}

export const emailWelcome = async (firstname: string, to: string, locale?: string) => {
  let locales = {}
  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        welcome_to: t("welcome_to"),
        think_crew: t("think_crew"),
        welcome_html_message2: t("welcome_html_message2"),
        click_here: t("click_here"),
        welcome_html_message4: t("welcome_html_message4"),
        welcome_html_message5: t("welcome_html_message5"),
        welcome_html_message6: t("welcome_html_message6"),
        welcome_html_message7: t("welcome_html_message7"),
        welcome_html_message8: t("welcome_html_message8"),
        welcome_html_message9: t("welcome_html_message9")
      }
    })
  const subject = 'Welcome to Think Crew'
  sendMail({
    to,
    subject,
    template: 'welcome',
    context: { firstname, subject, year: getYear(), ...locales }
  })
}

export const emailForgotPassword = async (firstname: string, to: string, code: string, locale?: string) => {
  let locales = {}
  const subject = 'Forgot Password'
  
  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        hi: t("hi"),
        registration_html_message1: t("registration_html_message1"),
        registration_html_message2: t("registration_html_message2"),
        registration_html_message3: t("registration_html_message3"),
        registration_html_message4: t("registration_html_message4")
      }
    })
  
  sendMail({
    to,
    subject,
    template: 'forgotpassword',
    context: { firstname, subject, url: `https://thinkcrew.com/forgotpassword?${code}`, year: getYear(), ...locales }
  })
}

export const emailInvite = async (fullname: string, to: string, code: string, projectName: string, locale?: string) => {
  let locales = {}

  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        hi: t("hi"),
        invite_html_message1: t("invite_html_message1"),
        invite_html_message2: t("invite_html_message2"),
        invite_html_message3: t("invite_html_message3"),
      }
    })

  const subject = 'Think Crew Invitation'
  sendMail({
    to,
    subject,
    template: 'invite',
    context: { fullname, subject, projectName, url: `https://thinkcrew.com/invite?${code}`, year: getYear(), ...locales }
  })
}

export const emailNotify = async (firstname: string, to: string, message: string, locale?: string) => {
  let locales = {}

  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        notify_html_message1: t("notify_html_message1")
      }
    })

  const subject = 'Think Crew Notification'
  sendMail({
    to,
    subject,
    template: 'notify',
    context: { firstname, subject, message, year: getYear(), ...locales }
  })
}

export const emailSubscribed = async (firstname: string, to: string, message?: string, locale?: string) => {
  let locales = {}

  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        subscribed_html_message1: t("subscribed_html_message1"),
        subscribed_html_message2: t("subscribed_html_message2"),
        manage_subscriptions: t("manage_subscriptions")        
      }
    })

  const subject = 'Think Crew Subscription'
  const context = { firstname, subject, year: getYear(), ...locales }
  if(message) Object.assign(context, { message })
  sendMail({
    to,
    subject,
    template: 'subscribed',
    context
  })
}

export const emailFarewell = async (firstname: string, to: string, locale?: string) => {
  let locales = {}

  await i18next.changeLanguage(locale)
    .then((t) => {
      locales = {
        hi: t("hi"),
        farewell_html_message1: t("farewell_html_message1"),
        farewell_html_message2: t("farewell_html_message2"),
        manage_subscriptions: t("manage_subscriptions")
      }
    })

  const subject = 'Think Crew is still here for you'
  const context = { firstname, subject, year: getYear(), ...locales }
  sendMail({
    to,
    subject,
    template: 'farewell',
    context
  })
}