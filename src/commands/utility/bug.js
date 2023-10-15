const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../../config.json");
const webhookClient = new Discord.WebhookClient({ url: config.webhooks.bugs });
const Guild = require("../../database/schemas/Guild");
const crypto = require("crypto");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "reportbug",
      aliases: ["bugreport", "bug"],
      description: "Report bugs to Hogy!",
      category: "Utility",
      usage: ["<text>"],
      cooldown: 60,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    var id = crypto.randomBytes(4).toString("hex");

    if (args.length < 1) {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(`${message.client.emoji.fail} ${language.report1}`),
        ],
      });
    }

    if (args.length < 3) {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(`${message.client.emoji.fail} ${language.report2}`),
        ],
      });
    }

    let invite = await message.channel
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .catch(() => {});

    let report = args.join(" ").split("").join("");
    const embed = new MessageEmbed()
      .setTitle("Bug Report")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report)
      .addField("User", `${message.member}`, true)
      .addField("User username", `${message.member.user.username}`, true)
      .addField("User ID", `${message.member.id}`, true)
      .addField("User Tag", `${message.member.user.tag}`, true)
      .addField("Server", `[${message.guild.name}](${invite || "none "})`, true)
      .addField("Bug Report ID:", `#${id}`, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor("GREEN");

    const confirmation = new MessageEmbed()
      .setTitle("Bug Report")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `${language.report3} Support [**Server**](${config.discord})`
      )
      .addField("Member", `${message.member}`, true)
      .addField("Message", `${report}`, true)
      .addField("Bug Report ID:", `#${id}`, true)
      .setFooter({ text: "Hogy ~ Ninja.69" })
      .setTimestamp()
      .setColor("GREEN");

    webhookClient.sendCustom({
      username: "Hogy Bug Report",
      avatarURL: `https://github.com/Ninja-69/Hoggy-Bot/assets/130167556/ef4861dd-a480-4735-8456-6cb8954797b8`,
      embeds: [embed],
    });

    message.author.send({ embeds: [confirmation] }).catch(() => {});
    message.delete().catch(() => {});
  }
};
