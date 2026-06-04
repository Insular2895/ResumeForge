from src.generate_cv import build_output_filename, parse_job


def test_parse_job_reads_indeed_wanted_for_company_and_cleans_title():
    parsed = parse_job(
        """
        Chargé(e) de facturation / Assistant(e) ADV - H/F- job post
        Wanted For Getraline
        Versailles (78)•Télétravail partiel

        Qui sommes-nous ?
        GETRALINE exerce un métier dédié aux technologies avancées.
        """
    )

    assert parsed["company"] == "Getraline"
    assert parsed["job_title"] == "Chargé de facturation / Assistant ADV"


def test_output_filename_removes_job_board_noise():
    parsed = {
        "company": "Getraline",
        "job_title": "Chargé de facturation / Assistant ADV",
    }

    filename = build_output_filename(parsed)

    assert filename.startswith("CV_Lucas_Pertusa_Getraline_Charge_de_facturation_Assistant_ADV_")
    assert "job_post" not in filename.lower()
    assert "H_F" not in filename


def test_parse_job_prefers_indeed_header_company_over_body_mentions():
    parsed = parse_job(
        """
        Assistant commercial export H/F- job post
        JP TRICARD Conseil
        Gonesse (95)

        À propos du poste
        Pour l'entreprise DESJARDIN, nous recherchons un assistant ou une assistante commercial(e) Export.

        Nous sommes l’entreprise Desjardin, PME industrielle française, spécialisée depuis plus de 150 ans.
        """
    )

    assert parsed["company"] == "JP TRICARD Conseil"
    assert parsed["job_title"] == "Assistant commercial export"


def test_parse_job_uses_body_company_when_header_is_missing():
    parsed = parse_job(
        """
        Assistant commercial export H/F- job post
        Gonesse (95)

        Pour l'entreprise DESJARDIN, nous recherchons un assistant ou une assistante commercial(e) Export.
        """
    )

    assert parsed["company"] == "Desjardin"


def test_parse_job_prefers_adecco_client_when_client_is_named():
    parsed = parse_job(
        """
        Gestionnaire ADV aéronautique (h/f)- job post
        Adecco - France – Sectors
        Plaisir (78)

        Adecco recrute pour son client STELLANTIS, spécialiste automobile.
        """
    )

    assert parsed["company"] == "Stellantis"


def test_parse_job_extracts_adecco_client_from_client_phrase():
    parsed = parse_job(
        """
        Gestionnaire ADV aéronautique (h/f)- job post
        Adecco - France – Sectors

        Adecco recrute pour son client SAFRAN AEROSTYSTEMS, spécialiste aéronautique.
        """
    )

    assert parsed["company"] == "Safran Aerostystems"


def test_parse_job_does_not_treat_generic_client_words_as_staffing_client():
    parsed = parse_job(
        """
        Gestionnaire ADV H/F- job post
        ARTUS INTERIM CERGY
        78700 Conflans-Sainte-Honorine

        Réaliser des synthèses de l'évolution de l'activité par Client et Gamme.
        """
    )

    assert parsed["company"] == "Artus Interim Cergy"
    assert parsed["job_title"] == "Gestionnaire ADV"


def test_parse_job_recognizes_administration_des_ventes_as_title():
    parsed = parse_job(
        """
        Administration des ventes H/F
        SML FOOD PLASTIC
        2 rue du Nouveau Bercy, 94227 Charenton-le-Pont
        """
    )

    assert parsed["company"] == "Sml Food Plastic"
    assert parsed["job_title"] == "Administration des ventes"
