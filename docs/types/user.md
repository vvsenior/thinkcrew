[<< Documentation](../index.md)

# User Types

| Type | Description |
| - | -
| [currentUser](#currentUser) | Current User data
| [usersPersons](#userspersons) | Users, Persons objects, used to send a information about other users
| [usersPersonsProjects](#userspersonsprojects) | A user's Projects and associated Users and Persons. Extend the usersPersons with Projects
| [userUpdate](#userupdate) | Request object for updating a User, does not include keys for some items for security

---

## currentUser

Current User data

```ts
{
  currentUser: {
    _id: ObjectID,
    language: string,
    dateFormat: string,
    units: string,
    showProjects: boolean,
    showEmail: boolean,
    showLinks: boolean,
    schedDesignsOrdered: [ObjectID],
    schedStripsOrdered: [ObjectID],
    schedPalettesOrdered: [ObjectID],
    schedPaneSetsOrdered: [ObjectID],
    currentProjectId: ObjectID,
    stripe: {
      subscriptions: [{
        _id: ObjectID,
        module: string
      }]
    }
  },
  persons: [{
    _id: ObjectID,
    userId: ObjectID,
    elementId: ObjectId,
    firstname: string,
    middlename: string|null,
    lastname: string,
    position: string|null,
    about: string|null,
    dob: string|null,
    _fullname: string
  }],
  contacts: [{
    _id: ObjectID,
    personId: ObjectID,
    valueType: string,
    name: string,
    value: string|null,
    note: string|null
  }],
  addresses: [{
    _id: ObjectID,
    personId: ObjectID,
    name: string,
    addressStreet1: string|null,
    addressStreet2: string|null,
    addressCity: string|null,
    addressState: string|null,
    addressZip: string|null,
    addressCountry: string|null,
  }]
}
```

## usersPersons

Users & Persons objects, used to communicate information about other users

```ts
{
  users: [{
    _id: ObjectID,
    online: boolean
  }],
  persons: [{
    _id: ObjectID,
    userId: ObjectID,
    elementId: ObjectId,
    firstname: string,
    middlename: string|null,
    lastname: string,
    position: string|null,
    about: string|null,
    dob: string|null,
    _fullname: string
  }]
}
```

## usersPersonsProjects

A user's Projects and associated Users and Persons. Extends the usersPersons with Projects

```ts
{
  projects: [{
    _id: ObjectID,
    name: string,
    description: string|null,
    season: string|null
  }],
  users: [{
    _id: ObjectID,
    online: boolean
  }],
  persons: [{
    _id: ObjectID,
    userId: ObjectID,
    elementId: ObjectId,
    firstname: string,
    middlename: string|null,
    lastname: string,
    position: string|null,
    about: string|null,
    dob: string|null,
    _fullname: string
  }]
}
```

## userUpdate

Request object for updating a User, does not include keys for some items for security

```ts
{
  email: string,
  stripe: Stripe Objects,
  language: string,
  dateFormat: string,
  units: string,
  showProjects: boolean,
  showEmail: boolean,
  showLinks: boolean,
  schedDesignsOrdered: [ObjectId],
  schedStripsOrdered: [ObjectId],
  schedPalettesOrdered: [ObjectId],
  schedPaneSetsOrdered: [ObjectId],
  currentProjectId: ObjectId|null
}
```