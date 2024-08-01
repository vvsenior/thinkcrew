[<< Documentation](../index.md)

# Person Routes

| Route | Description |
| - | -
| [POST api/2/person/](#post-api2person) | Create a new person
| [GET api/2/person/:ids](#get-api2personids) | Get Persons by ids
| [PATCH api/2/person/:id](#patch-api2personid) | Update a person
| [DELETE api/2/person/](#post-api2person) | Delete a person

---

## POST api/2/person/

Create a new person

### Request

#### Auth: 

- isValidToken

#### Body: 

```ts
{
  _id: ObjectID,
  userId: string|null,
  firstname: string|null,
  middlename: string|null,
  lastname: string|null,
  position: string|null,
  about: string|null,
  dob: ISO Date|null,
}
```

### Tasks Performed 

- create new Person

### Response

No response body.

---

## GET api/2/person/:ids

Get Persons by ids

### Request

#### URI: 

Include id(s) as strings with a comma delimiter in the url. Be sure not to include whitespace in url. 

#### Auth: 

- isValidToken

#### Example

`GET api/2/person/5cfe7c5c10c4330017ab4abb,6330f2ebcf4061314c6af142`

### Tasks Performed 

- get Persons by ids

### Response

#### Body

[persons](../types/person.md/#persons)

---

## PATCH api/2/person/:id

Update person

### Request

#### Auth: 

- isValidToken

#### Body:

[personUpdate](../types/person.md/#personupdate)

### Tasks Performed

- update Person object

### Response

No response body.

---

## DELETE api/2/person/:id

Permamently delete a person and all underlying Contacts and Addresses

**THIS ROUTE NEEDS SOME MORE THINKING** 

### Request

#### Auth: 

- isValidToken

### Tasks Performed

- get Permissions by documentId where Permission level is 'creator'
- get Person by id
- if user has permission to Person 
  - delete Contacts by personId
  - delete Addresses by personId

### Response

No response body
