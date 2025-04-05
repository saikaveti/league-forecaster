from enum import Enum

class Platform(Enum):
    def __str__(self):
        return str(self.value)
    
    Fantrax = "Fantrax"