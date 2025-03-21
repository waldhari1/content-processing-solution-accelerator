from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class Address(BaseModel):
    """
    A class representing an address.

    Attributes:
        street: Street address
        city: City, e.g. New York
        state: State, e.g. NY
        postal_code: Postal code, e.g. 10001
        country: Country, e.g. USA
    """

    street: Optional[str] = Field(description="Street address, e.g. 123 Main St.")
    city: Optional[str] = Field(description="City, e.g. New York")
    state: Optional[str] = Field(description="State, e.g. NY")
    postal_code: Optional[str] = Field(description="Postal code, e.g. 10001")
    country: Optional[str] = Field(description="Country, e.g. USA")

    @staticmethod
    def example():
        """
        Creates an empty example Address object.

        Returns:
            Address: An empty Address object.
        """
        return Address(street="", city="", state="", postal_code="", country="")

    def to_dict(self):
        """
        Converts the Address object to a dictionary.

        Returns:
            dict: The Address object as a dictionary.
        """
        return {
            "street": self.street,
            "city": self.city,
            "state": self.state,
            "postal_code": self.postal_code,
            "country": self.country,
        }


class PartyDetails(BaseModel):
    """
    A class representing the details of a party involved in the contract.

    Attributes:
        name: Name of the party.
        address: Address of the party.
        contact_number: Contact number of the party.
        email: Email address of the party.
        signature: Signature of the party.
    """

    name: Optional[str] = Field(description="Name of the party")
    address: Optional[Address] = Field(description="Address of the party")
    contact_number: Optional[str] = Field(description="Contact number of the party")
    email: Optional[str] = Field(description="Email address of the party")
    signature: Optional[str] = Field(description="Signature of the party")

    @staticmethod
    def example():
        """
        Creates an empty example PartyDetails object.

        Returns:
            PartyDetails: An empty PartyDetails object.
        """
        return PartyDetails(
            name="",
            address=Address.example(),
            contact_number="",
            email="",
            signature="",
        )

    def to_dict(self):
        """
        Converts the PartyDetails object to a dictionary.

        Returns:
            dict: The PartyDetails object as a dictionary.
        """
        return {
            "name": self.name,
            "address": self.address.to_dict() if self.address is not None else None,
            "contact_number": self.contact_number,
            "email": self.email,
            "signature": self.signature,
        }


class Exclusions(BaseModel):
    """
    A class representing exclusions in the property details.

    Attributes:
        items: List of exclusion items.
    """

    items: Optional[List[str]] = Field(description="List of exclusion items")

    @staticmethod
    def example():
        """
        Creates an empty example Exclusions object.

        Returns:
            Exclusions: An empty Exclusions object.
        """
        return Exclusions(items=[])

    def to_dict(self):
        """
        Converts the Exclusions object to a dictionary.

        Returns:
            dict: The Exclusions object as a dictionary.
        """
        return {
            "items": self.items,
        }


class PropertyDetails(BaseModel):
    """
    A class representing the details of the property.

    Attributes:
        address: Address of the property.
        property_type: Type of the property (e.g., Residential, Commercial).
        size: Size of the property (e.g., in square feet).
        description: Description of the property.
        exclusions: Exclusions in the property details.
    """

    address: Optional[Address] = Field(description="Address of the property")
    property_type: Optional[str] = Field(
        description="Type of the property (e.g., Residential, Commercial)"
    )
    size: Optional[str] = Field(
        description="Size of the property (e.g., in square feet)"
    )
    description: Optional[str] = Field(description="Description of the property")
    exclusions: Optional[Exclusions] = Field(
        description="Exclusions in the property details"
    )

    @staticmethod
    def example():
        """
        Creates an empty example PropertyDetails object.

        Returns:
            PropertyDetails: An empty PropertyDetails object.
        """
        return PropertyDetails(
            address=Address.example(),
            property_type="",
            size="",
            description="",
            exclusions=Exclusions.example(),
        )

    def to_dict(self):
        """
        Converts the PropertyDetails object to a dictionary.

        Returns:
            dict: The PropertyDetails object as a dictionary.
        """
        return {
            "address": self.address.to_dict() if self.address is not None else None,
            "property_type": self.property_type,
            "size": self.size,
            "description": self.description,
            "exclusions": self.exclusions.to_dict()
            if self.exclusions is not None
            else None,
        }


class ContractTerms(BaseModel):
    """
    A class representing the terms of the contract.

    Attributes:
        start_date: Start date of the contract.
        end_date: End date of the contract.
        price: Price agreed upon in the contract.
        payment_terms: Payment terms of the contract.
        special_conditions: Any special conditions in the contract.
        settlement_day: Settlement day of the contract.
    """

    start_date: Optional[str] = Field(
        description="Start date of the contract, e.g., 2021-01-01"
    )
    end_date: Optional[str] = Field(
        description="End date of the contract, e.g., 2021-12-31"
    )
    price: Optional[float] = Field(description="Price agreed upon in the contract")
    payment_terms: Optional[str] = Field(description="Payment terms of the contract")
    special_conditions: Optional[str] = Field(
        description="Any special conditions in the contract"
    )
    settlement_day: Optional[str] = Field(
        description="Settlement day of the contract, e.g., 2021-12-15"
    )

    @staticmethod
    def example():
        """
        Creates an empty example ContractTerms object.

        Returns:
            ContractTerms: An empty ContractTerms object.
        """
        return ContractTerms(
            start_date="",
            end_date="",
            price=0.0,
            payment_terms="",
            special_conditions="",
            settlement_day="",
        )

    def to_dict(self):
        """
        Converts the ContractTerms object to a dictionary.

        Returns:
            dict: The ContractTerms object as a dictionary.
        """
        return {
            "start_date": self.start_date,
            "end_date": self.end_date,
            "price": self.price,
            "payment_terms": self.payment_terms,
            "special_conditions": self.special_conditions,
            "settlement_day": self.settlement_day,
        }


class FinancingDetails(BaseModel):
    """
    A class representing the financing details.

    Attributes:
        loan_amount: Amount of the loan.
        term_of_note: Term of the note.
        interest_rate: Interest rate of the loan.
        monthly_payment: Monthly payment amount.
        lender_name: Name of the lender.
        amortization: Amortization details.
        buyer_agreement: Agreement details by the buyer.
        seller_agreement: Agreement details by the seller.
        conventional_loan_details: Details of the conventional loan.
    """

    loan_amount: Optional[float] = Field(description="Amount of the loan")
    term_of_note: Optional[str] = Field(description="Term of the note")
    interest_rate: Optional[float] = Field(description="Interest rate of the loan")
    monthly_payment: Optional[float] = Field(description="Monthly payment amount")
    lender_name: Optional[str] = Field(description="Name of the lender")
    amortization: Optional[str] = Field(description="Amortization details")
    buyer_agreement: Optional[str] = Field(description="Agreement details by the buyer")
    seller_agreement: Optional[str] = Field(
        description="Agreement details by the seller"
    )
    conventional_loan_details: Optional[str] = Field(
        description="Details of the conventional loan"
    )

    @staticmethod
    def example():
        """
        Creates an empty example FinancingDetails object.

        Returns:
            FinancingDetails: An empty FinancingDetails object.
        """
        return FinancingDetails(
            loan_amount=0.0,
            term_of_note="",
            interest_rate=0.0,
            monthly_payment=0.0,
            lender_name="",
            amortization="",
            buyer_agreement="",
            seller_agreement="",
            conventional_loan_details="",
        )

    def to_dict(self):
        """
        Converts the FinancingDetails object to a dictionary.

        Returns:
            dict: The FinancingDetails object as a dictionary.
        """
        return {
            "loan_amount": self.loan_amount,
            "term_of_note": self.term_of_note,
            "interest_rate": self.interest_rate,
            "monthly_payment": self.monthly_payment,
            "lender_name": self.lender_name,
            "amortization": self.amortization,
            "buyer_agreement": self.buyer_agreement,
            "seller_agreement": self.seller_agreement,
            "conventional_loan_details": self.conventional_loan_details,
        }


class RealEstateContract(BaseModel):
    """
    A class representing a real estate contract.

    Attributes:
        contract_id: Unique identifier for the contract.
        buyer_details: Details of the buyer.
        seller_details: Details of the seller.
        property_details: Details of the property.
        contract_terms: Terms of the contract.
        financing_details: Financing details of the contract.
        listing_broker: Information about the listing broker.
        selling_broker: Information about the selling broker.
        seller_attorney: Information about the seller's attorney.
        buyer_attorney: Information about the buyer's attorney.
    """

    contract_id: Optional[str] = Field(description="Unique identifier for the contract")
    buyer_details: Optional[PartyDetails] = Field(description="Details of the buyer")
    seller_details: Optional[PartyDetails] = Field(description="Details of the seller")
    property_details: Optional[PropertyDetails] = Field(
        description="Details of the property"
    )
    contract_terms: Optional[ContractTerms] = Field(description="Terms of the contract")
    financing_details: Optional[FinancingDetails] = Field(
        description="Financing details of the contract"
    )
    listing_broker: Optional[PartyDetails] = Field(
        description="Information about the listing broker"
    )
    selling_broker: Optional[PartyDetails] = Field(
        description="Information about the selling broker"
    )
    seller_attorney: Optional[PartyDetails] = Field(
        description="Information about the seller's attorney"
    )
    buyer_attorney: Optional[PartyDetails] = Field(
        description="Information about the buyer's attorney"
    )

    @staticmethod
    def example():
        """
        Creates an empty example RealEstateContract object.

        Returns:
            RealEstateContract: An empty RealEstateContract object.
        """
        return RealEstateContract(
            contract_id="",
            buyer_details=PartyDetails.example(),
            seller_details=PartyDetails.example(),
            property_details=PropertyDetails.example(),
            contract_terms=ContractTerms.example(),
            financing_details=FinancingDetails.example(),
            listing_broker=PartyDetails.example(),
            selling_broker=PartyDetails.example(),
            seller_attorney=PartyDetails.example(),
            buyer_attorney=PartyDetails.example(),
        )

    def to_dict(self):
        """
        Converts the RealEstateContract object to a dictionary.

        Returns:
            dict: The RealEstateContract object as a dictionary.
        """
        return {
            "contract_id": self.contract_id,
            "buyer_details": self.buyer_details.to_dict()
            if self.buyer_details is not None
            else None,
            "seller_details": self.seller_details.to_dict()
            if self.seller_details is not None
            else None,
            "property_details": self.property_details.to_dict()
            if self.property_details is not None
            else None,
            "contract_terms": self.contract_terms.to_dict()
            if self.contract_terms is not None
            else None,
            "financing_details": self.financing_details.to_dict()
            if self.financing_details is not None
            else None,
            "listing_broker": self.listing_broker.to_dict()
            if self.listing_broker is not None
            else None,
            "selling_broker": self.selling_broker.to_dict()
            if self.selling_broker is not None
            else None,
            "seller_attorney": self.seller_attorney.to_dict()
            if self.seller_attorney is not None
            else None,
            "buyer_attorney": self.buyer_attorney.to_dict()
            if self.buyer_attorney is not None
            else None,
        }
