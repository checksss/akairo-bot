# Akairo Bot

Akairo Bot is a Discord bot that uses the [Discord Akairo](https://github.com/discord-akairo/discord-akairo) framework and [TypeScript](https://github.com/microsoft/TypeScript)

## Installation

* Install MongoDB Server Community from [MongoDB](https://www.mongodb.com/download-center/community).
* Get a Discord bot token from Discord
* Make a .env file (see .env.example) and put it in the `./dist/` directory
* Run: `npm install` in Terminal or CMD
* In .env, please set the AUTHOR field to `329651188641431574`. If you wish to change it, change it to a valid Discord user's ID.

## Using TSC
If you want to run a pre-transpiled version of this, navigate to ./dist/ then run `node bot.ts`. Otherwise, you can run `tsc -p ./tsconfig.json`, `cd dist`, then `node bot.js`.

## Usage

```bash
cd dist
node bot.js
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

#### Made by @notavirus.exe#8093v