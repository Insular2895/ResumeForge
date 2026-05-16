from pathlib import Path


# =========================
# Chemins projet
# =========================

# Racine du projet : cv-tailor-v1/
BASE_DIR = Path(__file__).resolve().parent.parent


# =========================
# Dossiers
# =========================

DATA_DIR = BASE_DIR / "data"
REFERENCE_DIR = DATA_DIR / "reference"
INPUT_DIR = DATA_DIR / "input"
OUTPUT_DIR = DATA_DIR / "output"
COVER_LETTERS_DIR = OUTPUT_DIR / "cover_letters"
COMPANY_PROFILES_DIR = DATA_DIR / "company_profiles"
TRACKER_DIR = DATA_DIR / "tracker"

TEMPLATES_DIR = BASE_DIR / "templates"


# =========================
# Fichiers principaux
# =========================

MASTER_PROFILE_PATH = REFERENCE_DIR / "master_profile.xlsx"
BASE_CV_TEMPLATE_PATH = TEMPLATES_DIR / "base_cv.docx"
JOB_DESCRIPTION_PATH = INPUT_DIR / "job_description.txt"
LAST_RUN_REPORT_PATH = OUTPUT_DIR / "last_run_report.json"
APPLICATION_CONTEXT_PATH = OUTPUT_DIR / "application_context.json"
LETTER_RESULT_PATH = COVER_LETTERS_DIR / "letter_result.json"


# =========================
# Pipeline candidature / LM
# =========================

APPLICATION_TRACKER_PATH = DATA_DIR / "application_tracker.xlsx"
APPLICATION_TRACKER_CSV_PATH = TRACKER_DIR / "applications.csv"
RAW_JOB_URLS_PATH = INPUT_DIR / "job_urls.txt"
CV_MARKDOWN_SUFFIX = ".md"
LETTER_VALIDATION_SUFFIX = "_validation.json"
BASE_COVER_LETTER_EXAMPLE_PATH = TEMPLATES_DIR / "base_cover_letter_example.docx"
BASE_COVER_LETTER_PATH = TEMPLATES_DIR / "base_cover_letter.docx"
LM_TEMPLATE_MD_PATH = TEMPLATES_DIR / "LM_template.md"
LM_DEMO_VALIDEE_MD_PATH = TEMPLATES_DIR / "LM_demo_validee.md"
LM_INSTRUCTIONS_MD_PATH = TEMPLATES_DIR / "LM_instructions.md"
COMPANY_CACHE_TTL_DAYS = 30


# =========================
# Paramètres génération CV
# =========================

DEFAULT_MAX_EXPERIENCES = 2
DEFAULT_MAX_LEADERSHIP = 1
DEFAULT_MAX_CERTIFICATIONS = 2
DEFAULT_MAX_TECHNICAL_SKILLS = 8

MAX_FILENAME_LENGTH = 115


# =========================
# Création automatique des dossiers
# =========================

def ensure_project_directories():
    directories = [
        DATA_DIR,
        REFERENCE_DIR,
        INPUT_DIR,
        OUTPUT_DIR,
        COVER_LETTERS_DIR,
        COMPANY_PROFILES_DIR,
        TRACKER_DIR,
        TEMPLATES_DIR,
    ]

    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)


ensure_project_directories()
