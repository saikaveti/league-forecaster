CREATE TABLE fantasy.FantasyLeague (
    AccountId VARCHAR(255) NOT NULL,
    Platform VARCHAR(50) NOT NULL,
    Sport VARCHAR(50) NOT NULL,
    LeagueId VARCHAR(255) NOT NULL,
    LeagueName VARCHAR(255) NOT NULL,
    TeamId VARCHAR(255) NOT NULL,
    TeamName VARCHAR(255) NOT NULL,
    PRIMARY KEY (AccountId, Platform, Sport, LeagueId)
);