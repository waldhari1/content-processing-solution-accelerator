import logging
import pytest
from pages.HomePage import HomePage
 
logger = logging.getLogger(__name__)
 
# Define step-wise test actions for Golden Path
golden_path_steps = [
    ("Validate home page is loaded", lambda home: home.validate_home_page()),
     ("Select Invoice Schema", lambda home: home.select_schema("Invoice")),
    ("Upload Invoice documents", lambda home: home.upload_files("Invoice")),
    ("Refresh page till status is updated to Completed", lambda home: home.refresh()),
    ("Validate extracted result for Invoice", lambda home: home.validate_invoice_extracted_result()),
    ("Modify Extracted Data JSON & submit comments", lambda home: home.modify_and_submit_extracted_data()),
    ("Validate process steps for Invoice", lambda home: home.validate_process_steps()),
    ("Select Property Loss Damage Claim Form Schema", lambda home: home.select_schema("Property")),
    ("Upload Property Loss Damage Claim Form documents", lambda home: home.upload_files("Property")),
    ("Refresh page till status is updated to Completed", lambda home: home.refresh()),
    ("Validate extracted result for Property Loss Damage Claim Form", lambda home: home.validate_property_extracted_result()),
    ("Validate process steps for Property Loss Damage Claim Form", lambda home: home.validate_process_steps()),
    ("Validate Delete files", lambda home: home.delete_files())
]
 
# Generate readable test step IDs
golden_path_ids = [f"{i+1:02d}. {desc}" for i, (desc, _) in enumerate(golden_path_steps)]


@pytest.mark.parametrize("description, action", golden_path_steps, ids=golden_path_ids)
def test_content_processing_steps(login_logout, description, action, request):
    """
    Executes Golden Path content processing steps with individual log entries.
    """
    request.node._nodeid = description

    page = login_logout
    home = HomePage(page)
 
    logger.info(f"Running test step: {description}")
    try:
        action(home)
    except Exception as e:
        logger.error(f"Step failed: {description}")
        raise
 
    # Optionally attach to report
    request.node._report_sections.append(("call", "log", f"Step passed: {description}"))
