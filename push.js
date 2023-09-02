const shell = require('shelljs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const workingDirectory = process.cwd()
let origin = 'origin main';
const arguments = process.argv.splice(2);

// optional params 
let SKIP_MESSAGE = false, RUN_HEROKU = false;

// change working directory
shell.cd(`${workingDirectory}`)

if (arguments.length > 0)
{
    arguments.forEach((command)=>{
        switch (command.toUpperCase())
        {
            case '--SKIP-MESSAGE':
                SKIP_MESSAGE = true;
            break;

            case '--HEROKU':
                RUN_HEROKU = true;
            break;

            default:
                if (command.indexOf("=") > 0)
                {
                    const commandSplit = command.split('=');
                    if (commandSplit[0].toUpperCase() === '--ORIGIN') origin = `origin ${commandSplit[1]}`;
                }
        }
    })
}

// requires git!
if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

// run git add 
if (shell.pwd().stdout === workingDirectory)
{
    // can proceed
    if (shell.exec("git add .").code === 0)
    {
        if (SKIP_MESSAGE === false)
        {
            readline.question('Message (Enter to Skip): ', message => {
                message = message.trim().length === 0 ? 'wip' : message;
                readline.close();
                push(message)
            });
        }
        else
        {
            push()
        }
    }
    
}

function push(message = 'wip')
{
    // execute commit
    if (shell.exec(`git commit -m "${message}"`).code === 0)
    {

        // push to github
        if (shell.exec(`git push ${origin}`).code === 0)
        {
            // done
            shell.echo("\nPushed to GITHBUB!\n")

            // push to heroku?
            if (RUN_HEROKU)
            {
                if (!shell.which('heroku')) {
                    shell.echo('Sorry, this script requires heroku');
                    shell.exit(1);
                }
                else
                {
                    shell.echo("Running deployment to HEROKU\n");
                    if (shell.exec(`git push heroku main`).code === 0) shell.echo("\nPushed to HEROKU!\n");
                }
            }
        }
    }
    else
    {
        shell.echo("Could not commit locally")
        shell.exit(1)
    }
}