from src.application.domain_vocabulary_builder import build_domain_enrichment_prompt


def test_domain_enrichment_prompt_contains_methodology():
    prompt = build_domain_enrichment_prompt("Process orders, prepare commercial documentation, manage customs.")

    assert "actions explicites" in prompt
    assert "actions implicites" in prompt
    assert "vague 1" in prompt
    assert "vague 4" in prompt
    assert "explicit_in_jd" in prompt
    assert "implicit_in_domain" in prompt
    assert "transferable" in prompt

