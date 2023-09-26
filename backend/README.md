# ArduinoControl
**extends** [Board](http://johnny-five.io/api/board/)
| Properties |  Methods  | Events |
|:-----------|:----------|:-------|
| .servo     | ready     | ready  |
| .servoReady|  openDoor |        |
| .servoToClick       | cooldown  |        |
|.servoToReset| || 

### Properties

#### .servo
A servo component that attaches to class  
type [Servo](http://johnny-five.io/api/servo/)
___
#### .servoReady
If servo is ready or not  
type [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
___
#### .servoToClick
The position servo moves to for clicking  
type [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
___
#### .servoToReset
The position servo moves to after clicking  
type [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)




### Methods
#### ready()
Called automatically on ready. Initiates [Servo](http://johnny-five.io/api/servo/)  
returns: [<void>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

___
#### openDoor()
Makes servo moved to defined .servoToClick then .servoToReset  
returns: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
| Parameter |	Type	|Default	 |Required | Description |
|:-----|:--------|:------|:-----|:-----|
| none   | none |  |  | none |

example:
```js
ArduinoControl.openDoor()
```
___
#### cooldown()
Sets .servoReady to false for time hardcoded in function(2s)  
returns: [<void>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)


| Parameter |	Type	|Default	 |Required | Description |
|:-----|:--------|:------|:-----|:-----|
| none   | none |  |  | none |

### Events
#### ready
When the [Board](http://johnny-five.io/api/board/) has initialized. Then creates .servo and sets .servoReady to true






____
# DataBaseManager

| Properties |  Methods  |
|:-----------|:----------|
| .sequelize | createAccount |   
|            | login  |        
|            | findByName  |    
|            | getAll|
|            |updateEnabled|
|            |store|
|            |initTables|

### Properties

#### .sequelize
Creates main sequelize entrypoint  
type [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize)
___





### Methods
#### createAccount(username, password, enabled, admin)
Creates new entry to Users table  
returns: [<void>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)
| Parameter |	Type	  |Default|Required| Description |
|:----------|:--------|:------|:-------|:-----|
| username  | string  |       |  yes   | The name of user |
| password  | string  |       |  yes   | By default unencrypted password |
| enabled   | boolean | true  |  no    | If user is allowed to openDoor |
| isAdmin   | boolean | false |  no    | If user is allowed to disable others |

example:
```js
DataBaseManager.createAccount("John", "Secure-Password")
// equivelant to
DataBaseManager.createAccount("John", "Secure-Password", true, false)

// Make sure there are NO spaces in either username or password as this will cause trouble in database
```
___

#### login(password)
Finds user by password  
returns: [Promise<Model|null>](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findOne)
| Parameter |	Type	|Default	 |Required | Description |
|:-----|:--------|:------|:-----|:-----|
| password   | string |  | yes | password to search for |

example:
```js
DataBaseManager.login("Secure-Password").then(user => {
  if(user === null) {
    console.log("User not found")
    return
  }
  console.log(user.name + " : was found")
})
```
___
#### findByName(name)
Finds user by name 
returns: [Promise<Model|null>](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findOne)
| Parameter |	Type	|Default	 |Required | Description |
|:-----|:--------|:------|:-----|:-----|
| name   | string |  | yes | name to search for |

example:
```js
DataBaseManager.findByName("John").then(user => {
  if(user === null) {
    console.log("User not found")
    return
  }
  console.log(user.name + " : was found")
})
```
___
#### getAll()
Get all users in Users table   
returns: [Promise<Object<name, enabled>>]()

example:
```js
DataBaseManager.getAll("John").then(users => {
  users.forEach(user => {
    console.log(user.name + " is enabled : " + user.enabled)
  })
})
```

____

#### updateEnabled(name, isEnabled)
Finds a user then updates their enabled status   
returns: [<void>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)
| Parameter |	Type	|Default	 |Required | Description |
|:-----|:--------|:------|:-----|:-----|
| name   | string |  | yes | name of the user to update |
| isEnabled   | boolean |  | yes | if user should be enabled or disabled |

___

#### store()
Creates and returns a sessionStore   
returns: [SessionStore]()
example: 
```js
const session = require('express-session')
const express = require("express");

app.use(session({
    store: DataBaseManager.store(),
    secret: "our-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {}
}))
```