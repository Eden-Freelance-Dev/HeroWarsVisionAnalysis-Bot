<h1>NEW REPO SETUP GUIDE</h1>

1. Click on the ![New](https://cdn.discordapp.com/attachments/791596798900437032/797398830621392926/unknown.png) button to create a new repo.

2. Name your repo something like [Usage in Pascal Case]-Bot. For example, something like `HealthCare-Bot`.

3. Select the template ![](https://cdn.discordapp.com/attachments/791596798900437032/797420299930435601/unknown.png).

4. Click on the ![Create Repository](https://cdn.discordapp.com/attachments/791596798900437032/797420055943184384/unknown.png) button to create the repo.

5. Wait for it to generate, then change its description to be in the format of `[Fiverr Username]/[Discord Tag]` and clone the repo.

6. Create a `config.json` in the root file of the repo and paste the following in:
   ```js
   {
    "PREFIX": "!",
    "TOKEN": "NzgxMDk4MjE5Mzc5NjIxOTI4.X74sZw.9L_psUPOTNVPxT5ddN3mtkhl3jY"
   }
   ```
   Remember to save it after changing it.

7. Run `npm init -y` and `npm i discord.js` in the root of the repo.
8. Run `node .` to run the bot.
