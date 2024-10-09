import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import GuestRegistrationCard from "./GuestRegistrationCard";
import { name } from "file-loader";


let guestData = {
    // Personal Information
    name: "John",
    surname: "Doe",
    firstName: "John",
    company: "Acme Inc.",
    profession: "Software Engineer",
    travelAgent: "Global Travels",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    country: "USA",
    state: "NY",
    postalCode: "10001",
    email: "john.doe@example.com",
    phoneFax: "+1 (212) 555-1234",
    priorityClubNumber: "PC987654321",

    // Passport Information
    passportNumber: "P1234567",
    passportDateOfIssue: "2020-01-15",
    passportDateOfExpiry: "2030-01-14",
    passportPlaceOfIssue: "New York",
    nationality: "American",
    dateOfBirth: "1985-06-20",

    // Visa Information
    visaCrgNumber: "V9876543",
    visaDateOfIssue: "2023-05-01",
    visaDateOfExpiry: "2024-04-30",
    visaPlaceOfIssue: "Indian Consulate, New York",

    // Travel Information
    arrivedFrom: "New York",
    proceedingTo: "Mumbai",
    arrivalInIndia: "2023-07-15",
    durationOfStay: "14 days",
    purposeOfVisit: "Business",

    // Hotel Stay Information
    arrivalDate: "2023-07-15",
    arrivalFlight: "AI101",
    eta: "14:30",
    departureDate: "2023-07-29",
    etd: "10:45",
    dropRequired: "Yes",
    departureFlight: "AI102",

    // Room Information
    roomNo: "505",
    roomType: "Deluxe",
    roomRate: "₹8,500",
    noOfGuests: "1",
    reservationNo: "RES123456",
    noOfRooms: "1",

    // Payment Information
    paymentModes: {
        cash: false,
        visaCard: true,
        masterCard: false,
        americanExpress: false,
        dinersCard: false,
        jcbCard: false,
        billsToCompany: true,
        voucher: false,
        foreignCurrency: false,
        travellersCheques: false,
        others: false,
    },
    creditCardNumber: '1234 5678 9012 3456',
    creditCardExpiry: '12/25',
    gstNo: 'GST123456789',

    // Additional Remarks
    remarks: "Late check-out requested"
};

const PdfView = () => {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <PDFViewer width="100%" height="100%">
                <GuestRegistrationCard guestData={guestData} />
            </PDFViewer>
        </div>
    );
}

export default PdfView;