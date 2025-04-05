class FangraphsETL:
    def extract_range(self, start_date, end_date):
        """
        Extract data for a given date range.
        :param start_date: Start date of the range.
        :param end_date: End date of the range.
        """
        # Implementation for extracting data for the date range
        pass

    def transform_range(self, data):
        """
        Transform the extracted data for a date range.
        :param data: Raw data to be transformed.
        """
        # Implementation for transforming the data
        pass

    def load_range(self, transformed_data):
        """
        Load the transformed data for a date range into the target system.
        :param transformed_data: Data to be loaded.
        """
        # Implementation for loading the transformed data
        pass

    def extract_split(self, split_type):
        """
        Extract data for a specific split type (e.g., home/away, left/right).
        :param split_type: Type of split to extract.
        """
        # Implementation for extracting data for the split type
        pass

    def transform_split(self, data):
        """
        Transform the extracted data for a specific split type.
        :param data: Raw data to be transformed.
        """
        # Implementation for transforming the data
        pass

    def load_split(self, transformed_data):
        """
        Load the transformed data for a specific split type into the target system.
        :param transformed_data: Data to be loaded.
        """
        # Implementation for loading the transformed data
        pass