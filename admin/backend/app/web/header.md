Welcome to the API documentation.

You will find below all the informations that you will need to build application.

---

## Basics

The API entry point is <a href="https://api.example.com/web/" target=_blank>https://api.example.com/web/</a>.

It is an (almost) <b>RESTful API</b> using a <b>secured http (https)</b> as transport layer.

As following the main RESTful standards, the HTTP verbs are used as described below.

| Verb                                          | Action                             |
| --------------------------------------------- | ---------------------------------- |
| <span class="type type__get">GET</span>       | read-only access                   |
| <span class="type type__post">POST</span>     | create new object (writing)        |
| <span class="type type__put">PUT</span>       | updating existing object (writing) |
| <span class="type type__delete">DELETE</span> | removing object (writing)          |

## Request structure

All requests to a resource that contains a SYST-401 error requires the following header

```sh
Authorization: Bearer [token]
```

- [token] is the token obtains when log in into the application.

Response structure
Each call to the API will have the following structure response (JSON example)

```sh
{
  success: xxx,
  data: {...},
  message: xxx
}
```

#### Success

This is the global status of the response (string).

#### Data

This is the data container (object).

This is the most important container to work with.It contains all the informations returned when calling a resource.

For all the resources described in this documentation, the data returned in success case are put in this container.

```sh
data: {...}
```
