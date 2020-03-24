from .tank import Tank
from .bullet import Bullet
from .objects import Object
from .conditions import Condition
from .actions import Action
from .AINode import AINode
from .level import Level

from copy import deepcopy

from json import JSONEncoder
import json


class PlayBack:

    def __init__(self, level):
        self.level = level
        self.frames = []

        # index of the winning ai
        self.winner = None
        self.player_ids = []

    def add_frame(self, state):
        self.frames.append(Frame(state))
       
    # use -1 for bots
    def to_json(self, player_ids):
        self.player_ids = player_ids
        encoder = PlayBackEncoder()
        return encoder.encode(self)


class Frame:
    tanks = []
    bullets = []

    # Extract a frame from state data.
    def __init__(self, state):
        self.tanks = deepcopy(state.tanks)
        self.bullets = deepcopy(state.bullets)
        self.visibility = [{'tanks': t.visible_tanks(state), 'bullets': t.visible_bullets(state)} for t in state.tanks]
        self.events = []
        self.scores = deepcopy(state.scores)


class PlayBackEncoder(JSONEncoder):

    def default(self, obj):
        if isinstance(obj, PlayBack):
            return obj.__dict__
        elif isinstance(obj, Frame):
            return obj.__dict__
        elif isinstance(obj, Tank):
            return {'pos': obj.get_pos(), 'rotation': obj.get_rotation(), 'turret_rotation': obj.get_turret_rotation(), 'health': obj.get_health(), 'ai_path': obj.ai_path}
        elif isinstance(obj, Bullet):
            return {'pos': obj.get_pos()}
        elif isinstance(obj, Object):
            return int(obj)
        elif isinstance(obj, Level):
            return obj.objects
        else:
            print(obj)
            #return json.JSONEncoder.default(self, object)
