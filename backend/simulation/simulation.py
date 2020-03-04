from .levelloader import LevelLoader
from .tank import Tank
from .objects import Object
from .visual_debug import *
from .AINode import ActionNode, ConditionNode
from .conditions import Condition
from .actions import Action
from .playback import PlayBack, PlayBackEncoder
from .level import Level

import json

import os

import time

MAX_GAME_LENGTH = 10000


class SimulationState:
    level = None
    tanks = []
    bullets = []
    frames_passed = 0

    def __init__(self, level, players):
        self.level = level
        self.tanks = [Tank(x) for x in players]


class Simulation:

    def __init__(self, level, players):
        self.ended = False
        self.state = SimulationState(level, players)
        self.set_starting_position()
        self.winner = None
        self.playback = PlayBack(level)

    def set_starting_position(self):
        spawns = self.get_spawns()
        for i, tank in enumerate(self.get_tanks()):
            tank.spawn = spawns[i]
            tank.set_pos(tank.spawn[0], tank.spawn[1])
            if spawns[i][1] < self.state.level.get_height() / 2:
                tank.set_rotation(180)
            else:
                tank.set_rotation(0)

    def get_spawns(self):
        result = []

        for obj, x, y in self.state.level.iterate():
            if obj == Object.SPAWN:
                result.append((float(x) + 0.5, float(y) + 0.5))
        return result

    def has_ended(self):
        return self.ended

    def get_tanks(self):
        return self.state.tanks

    def get_bullets(self):
        return self.state.bullets

    def step(self):
        if self.state.frames_passed > MAX_GAME_LENGTH or len(self.get_tanks()) <= 1:
            self.ended = True
            self.playback.winner = self.get_winner()
            return

        for tank in self.get_tanks():
            tank.collectActions(self.state)

        for tank in self.get_tanks():
            tank.executeActions(self.state)

        for bullet in self.get_bullets():
            bullet.update(self.state)

        for tank in self.get_tanks():
            if tank.get_health() <= 0:
                self.state.tanks.remove(tank)

        DRAW_WORLD(self.state)
        self.state.frames_passed += 1

        self.playback.add_frame(self.state)

    def get_playback(self):
        return self.playback

    def get_winner(self):
        if len(self.get_tanks()) == 1:
            return self.get_tanks()[0].ai
        else:
            return None


def test_simulation():
    level_loader = LevelLoader()

    false_node = ActionNode([Action(8, {})])
    true_node = ActionNode([Action(1, {'obj': Object.HILL}), Action(8, {}), Action(5, {'obj': Object.TANK})])

    ai = ConditionNode(Condition(1, {'obj': Object.TANK, 'distance': 10}), true_node, false_node)

    this_dir = os.path.dirname(os.path.realpath(__file__))
    level_dir = os.path.join(this_dir, "levels")
    level2_path = os.path.join(level_dir, "level2.png")

    a = Simulation(level_loader.load_level(level2_path), [ai, ai])

    while not a.has_ended():
        print(a.step())

    if a.get_winner() is not None:
        print("PLAYER: " + a.__str__() + " has won!!!!")
    else:
        print("Its a tie")

    encoder = PlayBackEncoder()

    print(encoder.encode(a.get_playback()))
    # PlayBackEncoder.encode(a.get_playback())
