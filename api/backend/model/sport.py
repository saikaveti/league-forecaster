from enum import Enum

class Sport(Enum):
    def __str__(self):
        return str(self.value)
    
    MLB = "MLB"
    NFL = "NFL"
    NBA = "NBA"
    NHL = "NHL"