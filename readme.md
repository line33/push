# Setup
Create an alias in your bash_profile or zshrc_profile 

```bash

alias push='node path-to-Push/push.js'

```

And that should do. 

You will have to restart your terminal or command line.

## Skip message
To skip message and stick to default use this command
```bash
push --skip-message
```

## Push to Heroku
To also run push to heroku use this command
```bash
push --heroku
```

## Change origin
To change push origin from the default ``origin main`` use this command
```bash
push --origin=local
```