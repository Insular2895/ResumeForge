from src.application.domain_vocabulary import load_domain_vocabulary


def test_load_supply_chain_domain_vocabulary():
    vocabulary = load_domain_vocabulary("operations_supply_chain")

    assert vocabulary["domain"] == "supply_chain"
    assert "1_domain_core" in vocabulary["waves"]
    assert "2_processes" in vocabulary["waves"]
    assert "3_documents_tools_constraints" in vocabulary["waves"]
    assert "4_operational_risks" in vocabulary["waves"]
    assert "bill of lading" in vocabulary["waves"]["3_documents_tools_constraints"]
    assert "blocage douane" in vocabulary["waves"]["4_operational_risks"]


def test_load_retail_operations_domain_vocabulary():
    vocabulary = load_domain_vocabulary("retail_operations")

    assert vocabulary["domain"] == "retail_operations"
    assert "réseau de boutiques" in vocabulary["waves"]["1_domain_core"]
    assert "KPI service client" in vocabulary["waves"]["3_documents_tools_constraints"]
