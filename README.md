# [@memecoin_bot](https://t.me/memecoin_bot)
Code of the [@memecoin_bot](https://t.me/memecoin_bot) Telegram bot. Reputation + coin economy inside the Telegram chat.
# Installation and local launch
1. Clone this repo: `git clone https://github.com/backmeupplz/memcoin`
2. Create `.env` file with environment variables listed below
3. Run `yarn install` in the root folder
4. Run `yarn distribute`
# Environment variables in `.env` file
* `USERNAME` — Telegram bot username
* `TOKEN` — Telegram bot token
* `MONGO` — URL of the mongo db
* `SECRET` — Secret key to generate auth token
* `PORT` — Port for API server
* `ADMIN_ID` — ID of the super admin chat

Please, consider refering to provided `env.sample` for further docs.
# API docs
In order to use API, you will have to obtain an API token from [@borodutch](https://t.me/borodutch). After you obtain the API token, you can see it with the `/token` command in private chat with [@memecoin_bot](https://t.me/memecoin_bot). All requests to the API should contain `token` header with your API token as a string.

API contains of the following methods sent to `http://188.166.96.198:1337`:

## GET `/user/:id`
Gets user data by their chat id
### Receives:
* `id` — user chat id
### Returns:
* User information in the format:
```json
{
  "chatId": 12345,
  "name": "Nikita Kolmogorov",
  "balance": 10
}
```
## POST `/transfer`
Transfers memecoins from one user to another
### Receives:
* `senderId` — chat id of the user to send
* `receiverId` — chat id of the user to receive
* `amount` — number of memecoins to transfer
### Returns:
* Success JSON if everything is ok:
```json
{ "success": true }
```

# Continuous integration
Any commit pushed to master gets deployed to [@memecoin_bot](https://t.me/memecoin_bot) via [CI Ninja](https://github.com/backmeupplz/ci-ninja).
# License
MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!