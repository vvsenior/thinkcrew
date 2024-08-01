[<< Documentation](../index.md)

# User Routes

| Route | Description |
| - | -
| [POST api/2/user/](#post-api2user) | Create a new user
| [POST api/2/user/register/:confimation](#post-api2userregisterconfimation) | Register user
| [POST api/2/user/login](#post-api2userlogin) | Login user by credentials 
| [POST api/2/user/login-by-token](#post-api2userlogin-by-token) | Login user by token
| [POST api/2/user/logout](#post-api2userlogout) | Logout user by token
| [POST api/2/user/forgot-password/:email](#post-api2userforgot-passwordemail) | Initiate forgot password transaction
| [POST api/2/user/forgot-password/:code](#post-api2userforgot-passwordcode) | Complete forgot password transaction
| [POST api/2/user/logout-all](#post-api2userlogout-all) | Emit a socket that logout all users
| [POST api/2/user/refresh-all](#post-api2userrefresh-all) | Emit a socket that refreshes all browser tabs
| [POST api/2/user/notify-all](#post-api2usernotify-all) | Emit a socket that sends an on screen notification to all users
| [GET api/2/user/:ids](#get-api2userids) | Get users & persons by user ids
| [GET api/2/user/by-email/:emails](#get-api2userby-emailemails) | Get users & persons by email address
| [GET api/2/user/email-check/:email](#get-api2useremail-checkemail) | Check if email address is already in use
| [GET api/2/user/projects](#get-api2userprojects) | Hydrate all of the user's projects and related users
| [GET api/2/user/location](#get-api2userlocation) | Get the user's physical location by request IP address
| [PATCH api/2/user](#patch-api2user) | Update user
| [PATCH api/2/user/password/:old/:new](#patch-api2userpasswordoldnew) | Update user's password
| [DELETE api/2/user/:id/obliviate](#delete-api2useridobliviate) | Permamently delete a user and all underlying data

---

## POST api/2/user/

Create a new user

### Request

#### Auth: none

#### Body: 

```ts
{
  firstname: string,
  middlename: string|null,
  lastname: string,
  email: string,
  password: string,
}
```

### Tasks Performed 

- create hash from plaintext password
- create new User, using hashed password
- does a Person exist with this email?
  - update the existing Person with the new User _id
  - if not, create new Person
  - create new Contact from email
- create new Registration
- send registration email

### Response

No response body.

---

## POST api/2/user/register/:confimation

Register user

### Request

#### Auth: none

### Tasks Performed

- get Register by register code
- get User by Register userId
- get Person by userId
- get Contacts by personId
- get Addresses by personId
- get Invites by User email
  - if Invites, create Permission for each Invite projectId
  - create Alert for each User in project that a new user has been added
- generate token
- update User with token, set active
- create mailchimp contact
- delete Register by registerId
- send welcome email

### Response

#### Body

[currentUser](../types/user.md/#currentUser)

---

## POST api/2/user/login

Login user by credentials

### Request

#### Auth: none

#### Body

```ts
{
  email: string,
  password: string
}
```

### Tasks Performed

- get User by credentials
- generate token
- update User token
- get Person by userId
- get Contacts by personId
- get Addresses by personId

### Response

#### Body

[currentUser](../types/user.md/#currentUser)

---

## POST api/2/user/login-by-token

Login user by token

### Request

#### Auth: 

- isValidToken

### Tasks Performed

- get Person by userId
- get Contacts by personId
- get Addresses by personId

### Response

#### Body

[currentUser](../types/user.md/#currentUser)

---

## POST api/2/user/logout

Logout user by token

### Request

#### Auth: 

- isValidToken

### Tasks Performed

- update User, set token to `null

### Response

No response body

---

## POST api/2/user/forgot-password/:email

Initiate forgot password transaction

### Request

#### Auth: none

### Tasks Performed

- get User by email
- create new ForgotPassword
- send email with ForgotPassword code

### Response

No response body.

---

## POST api/2/user/forgot-password/:code

Complete forgot password transaction

### Request

#### Auth: none

### Tasks Performed

- get ForgotPassword by code
- get User by ForgotPassword userId
- generate token
- update User token
- get Person by userId
- get Contacts by personId
- get Addresses by personId
- delete ForgotPassword

### Response

#### Body

[currentUser](../types/user.md/#currentUser)

### Note

On frontend, redirect user to change password page

---

## POST api/2/user/logout-all

Emit a socket that logout all users, for administration purposes

### Request

#### Auth: 

- isAdmin

### Tasks Performed

- update Users, set token to `null`
- socket emit 'LOGOUT'

### Response

No response body

---

## POST api/2/user/refresh-all

Emit a socket that refreshes all browser tabs, for administration purposes

### Request

#### Auth: 

- isAdmin

### Tasks Performed

- socket emit 'REFRESH_ALL'

### Response

No response body

---

## POST api/2/user/notify-all

Emit a socket that sends an on screen notification to all users, for administration purposes

### Request

#### Auth: 

- isAdmin

### Tasks Performed

- socket emit 'NOTIFY_ALL'

### Response

No response body

---

## GET api/2/user/:ids

Get users & persons by user ids. Multiple user ids accepted.

### Request

#### URI: 

Include id(s) as strings with a comma delimiter in the url. Be sure not to include whitespace in url. 

#### Auth:

- isValidToken

#### Example

`GET api/2/user/5cfe7c5c10c4330017ab4abb,6330f2ebcf4061314c6af142`

### Tasks Performed

- get Users by ids
- get Persons by userIds

### Response

#### Body

[usersPersons](../types/user.md/#userspersons)

---

## GET api/2/user/by-email/:emails

Get users & persons by email address. Multiple email addresses accepted.

### Request

#### URI:

Include email(s) as strings with a comma delimiter in the url. Be sure not to include whitespace in url. 

#### Auth:

- isValidToken

#### Example

`GET api/2/user/by-email/john@doe.com,jane@mail.com,steve@smith.com`

### Tasks Performed

- get Users by array of emails
- get Persons by userIds

### Response

#### Body

[usersPersons](../types/user.md/#userspersons)

---

## GET api/2/user/email-check/:email

Check if email address is already in use. Returns true if email is in use.

### Request

#### Auth: none

### Tasks Performed

- check if email is in use by any User

### Response

#### Body

```ts
boolean
```

---

## GET api/2/user/projects

Hydrate all of the user's projects and related users, persons

### Request

#### Auth: 

- isValidToken

### Tasks Performed

- get user's Permissions
- get Projects by Permission valueId / collectionId
- get Permissions for other users by Permission collectionId
- get Users by Permission userId
- get Persons by userId

### Response

#### Body

[usersPersonsProjects](../types/user.md/#userspersonsprojects)

---

## GET api/2/user/location

Get the user's physical location by request IP address

### Request

#### Auth: none

### Tasks Performed

- get user's physical location via ipapi.co (https://ipapi.co/)

### Response

#### Body

```json
{
    "ip": "8.8.8.8",
    "version": "IPv4",
    "city": "Mountain View",
    "region": "California",
    "region_code": "CA",
    "country_code": "US",
    "country_code_iso3": "USA",
    "country_name": "United States",
    "country_capital": "Washington",
    "country_tld": ".us",
    "continent_code": "NA",
    "in_eu": false,
    "postal": "94035",
    "latitude": 37.386,
    "longitude": -122.0838,
    "timezone": "America/Los_Angeles",
    "utc_offset": "-0700",
    "country_calling_code": "+1",
    "currency": "USD",
    "currency_name": "Dollar",
    "languages": "en-US,es-US,haw,fr",
    "country_area": 9629091.0,
    "country_population": 310232863,
    "asn": "AS15169",
    "org": "Google LLC"
    "hostname": "dns.google"
}
```

---

## PATCH api/2/user

Update user

### Request

#### Auth: 

- isValidToken

#### Body:

[userUpdate](../types/user.md/#userupdate)

### Tasks Performed

- update User object

### Response

No response body.

---

## PATCH api/2/user/password/:old/:new

Update user's password

### Request

#### Auth: 

- isValidToken

### Tasks Performed

- confirm old password is correct
- confirm new password meets standards
- create hash from plaintext new password
- generate token
- update User with new password hash, token

### Response

No response body.

---

## DELETE api/2/user/:id/obliviate

Permamently delete a user and all underlying data, for administration purposes

### Request

#### Auth: 

- isAdmin

### Tasks Performed

- get User by id
- get Persons by userId
- get Contacts by personId
- get Addresses by personId
- get Permissions by userId where Permission level is 'creator'
- get collections by Permission valueTypes
- ...delete all child data from above collections

### Response

No response body