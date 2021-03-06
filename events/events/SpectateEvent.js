const Event = require('../../models/Event').Event;
const Database = require('../../utils/Database/');
const Packets = require('../../utils/BanchoUtils/Packets');
const PacketConstant = require('../../utils/BanchoUtils/Packets/PacketConstants');
const Tokens = require("../../global/global").tokens;
const Parsers = require('../../utils/BanchoUtils/Parsers');
const ChannelManager = require("../../global/global").channels;
const Config = require('../../global/config.json');
const Misaki = require('../../misaki/bot');

class SpectateEvent extends Event {
  constructor() {
    super();
    this.name = "SpectateEvent";
    this.type = PacketConstant.client_startSpectating;
  }

  run(args) {
    const { user, data, token } = args;

    const spectated_user = Parsers.SpectateParser(data);

    if((Config.misaki && Config.misaki.enabled) && Misaki.getBotUser().user_id == spectated_user) {
      return;
    }

    const spectator = Tokens.FindUserID(spectated_user);
    if(!spectator) return;

    console.log(`[*] User ${user.username} started spectating ${spectator.user.username}.`);

    token.spectateUser(spectated_user);
    if(Tokens.GetJoinedChannel("#spectator", user)) ChannelManager.KickUser("#spectator", user);
    if(!Tokens.GetJoinedChannel("#spectator", spectator.user)) ChannelManager.JoinChannel("#spectator", spectator.user);
    ChannelManager.JoinChannel("#spectator", user);
  }
}

module.exports = SpectateEvent;
