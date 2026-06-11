from src.application.company_research import extract_company_facts_from_job_description


def test_generic_collaboration_does_not_create_unrelated_culture_fact():
    facts = extract_company_facts_from_job_description(
        "FERRO",
        "Collaboration avec la logistique et le commercial.",
    )

    assert facts == []


def test_explicit_trust_ownership_collaboration_phrase_creates_culture_fact():
    facts = extract_company_facts_from_job_description(
        "Ipsen",
        "Our culture is based on trust, ownership, and collaboration.",
    )

    assert any("ownership" in fact["fact"] for fact in facts)
