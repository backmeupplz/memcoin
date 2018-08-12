# [@memecoin_bot](https://t.me/memecoin_bot)
Code of the [@memecoin_bot](https://t.me/memecoin_bot) Telegram bot. Reputation + coin economy inside the Telegram chat.
# Installation and local launch
1. Clone this repo: `git clone https://github.com/backmeupplz/memcoin`
2. Create `.env` file with environment variables listed below
3. Run `yarn install` in the root folder
4. Run `yarn distribute`
# Environment variables in `.env` file
* `USERNAME` — Telegram bot username
* `SECRET` — Secret key for generate auth token
* `PORT` — Port for API server
* `TOKEN` — Telegram bot token
* `MONGO` — URL of the mongo db

Please, consider refering to provided `env.sample` for further docs.
# Continuous integration
Any commit pushed to master gets deployed to [@memecoin_bot](https://t.me/memecoin_bot) via [CI Ninja](https://github.com/backmeupplz/ci-ninja).
# License
MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!