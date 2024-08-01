[<< Documentation](../index.md)

# User Types

| Type | Description |
| - | -
| [persons](#persons) | Object containing Persons
| [personsUpdate](#personsupdate) | Request object for updating a Person, does not include keys for some items for security

---

## persons

Persons objects

```ts
[{
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
```

## personUpdate

Request object for updating a Person, does not include keys for some items for security

```ts
{
  userId: ObjectID,
  elementId: ObjectId,
  firstname: string,
  middlename: string|null,
  lastname: string,
  position: string|null,
  about: string|null,
  dob: string|null,
}
```