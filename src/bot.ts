import Discord from 'discord.js';
import { mongo } from './database';
class Bot {
  public CLIENT: Discord.Client;
  private _TOKEN: string;
  constructor(TOKEN: string) {
    this.CLIENT = new Discord.Client({
      intents: [Discord.GatewayIntentBits.Guilds]
    });
    this._TOKEN = TOKEN;
  }
  /**
   * Creates a connection with mongo
   */
  async connectDB(): Promise<void> {
    mongo(); // Connecting to database
  }
  /**
   *
   */
  //   registerCommands(): void {}

  //   registerEvents(): void {}

  /**
   * Connects to the Discord Client
   */
  connectClient(): void {
    this.CLIENT.login(this._TOKEN);
  }
}

export default Bot;
