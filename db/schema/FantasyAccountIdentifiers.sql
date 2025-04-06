CREATE TABLE FantasyAccountIdentifiers (
    Platform NVARCHAR(100) NOT NULL,
    Sport NVARCHAR(100) NOT NULL,
    AccountId NVARCHAR(100) NOT NULL,
    RetrieveId NVARCHAR(255) NOT NULL,
    PRIMARY KEY (Platform, Sport, AccountId)
);