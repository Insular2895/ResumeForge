from pathlib import Path
import pandas as pd


class ExcelProfileLoader:
    """
    Charge le fichier master_profile.xlsx et retourne un dictionnaire :
    {
        "experiences": DataFrame,
        "certifications": DataFrame,
        ...
    }
    """

    REQUIRED_SHEETS = {
        "experiences",
        "certifications",
        "job_families",
        "settings",
    }

    OPTIONAL_SHEETS = {
        "applications_tracker",
        "allowed_rewrite_blocks",
        "leadership_legacy",
        "skills",
        "skills_legacy",
        "skills_by_target",
        "skills_by_target_legacy",
    }

    def __init__(self, workbook_path):
        self.workbook_path = Path(workbook_path)

    @staticmethod
    def _normalize_sheet_name(name: str) -> str:
        return str(name).strip().lower()

    @staticmethod
    def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df.columns = [
            str(col).strip().lower().replace(" ", "_")
            for col in df.columns
        ]
        return df

    def load(self):
        if not self.workbook_path.exists():
            raise FileNotFoundError(f"Workbook not found: {self.workbook_path}")

        excel_file = pd.ExcelFile(self.workbook_path)

        # Mapping souple : Leadership -> leadership, Skills -> skills, etc.
        sheet_name_map = {
            self._normalize_sheet_name(sheet): sheet
            for sheet in excel_file.sheet_names
        }

        missing = [
            sheet
            for sheet in self.REQUIRED_SHEETS
            if sheet not in sheet_name_map
        ]

        if missing:
            available = ", ".join(excel_file.sheet_names)
            raise ValueError(
                f"Missing required sheets: {', '.join(missing)}. "
                f"Available sheets: {available}"
            )

        workbook = {}

        for normalized_name, original_name in sheet_name_map.items():
            df = pd.read_excel(self.workbook_path, sheet_name=original_name)
            df = self._normalize_columns(df)
            workbook[normalized_name] = df

        return workbook
