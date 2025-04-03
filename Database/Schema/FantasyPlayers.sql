CREATE TABLE fantasy.FantasyPlayers (
    Platform VARCHAR(50) NOT NULL,
    Sport VARCHAR(50) NOT NULL,
    PlayerId VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Team VARCHAR(100) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    Age INT NULL,
    PRIMARY KEY (Platform, Sport, PlayerId)
);