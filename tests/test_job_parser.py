from src.parsers.job_parser import parse_job_description


def test_job_parser_reads_indeed_salary_and_location_blocks():
    parsed = parse_job_description(
        """
        Détails de l'emploi
        Salaire

        À partir de 40 000 € par an
        Type de poste

        CDI
        Lieu
        Noisiel (77) - Télétravail partiel
        """
    )

    assert parsed["salary"] == "À partir de 40 000 € par an"
    assert parsed["location"] == "Noisiel (77) - Télétravail partiel"
