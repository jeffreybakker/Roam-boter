from simulation.simulation import simulate

from AIapi.grammar import converter

import logging
logger = logging.getLogger("debugLogger")


class SimulationPlayer:

    def run_botmatch(self, botmatch):
        """
        Expects a pending BotMatch instance and runs the simulation.
        """
        if botmatch.simulation.state == "DONE":
            raise Exception("Simulation already has run")

        bot = botmatch.bot
        bot_ai = bot.ais.first() # take first of all ais
        team_ai = botmatch.ai

        # convert ais to AINode objects
        bot_ai_eval_tree = converter.convert_aijson(bot_ai.ai)
        team_ai_eval_tree = converter.convert_aijson(team_ai.ai)

        # send team ai as first player
        playback = simulate([team_ai_eval_tree, bot_ai_eval_tree])
        # set winner
        winner = playback.winner

        if winner == 0:
            botmatch.winner = botmatch.team
        else:
            botmatch.winner = None

        botmatch.simulation.simulation = playback.to_json(botmatch.team_id, -1)
        botmatch.simulation.state = "DONE"
        botmatch.simulation.save()
        botmatch.save()





# Setup simulation player object
SIMULATION_PLAYER = SimulationPlayer()
