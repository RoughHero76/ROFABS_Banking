import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 10,
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Oswald',
        marginBottom: 10,
    },
    mainView: {
        border: '1 solid black',
        margin: 5,
        padding: 5,
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottom: '0.5 solid black',
        paddingBottom: 2,
        marginBottom: 2,
    },
    column: {
        flexDirection: 'column',

        flexGrow: 1,
        fontSize: 8,
        marginRight: 5,
    },
    label: {
        fontSize: 6,
        color: 'black',
        fontFamily: 'Oswald',
    },
    value: {
        fontSize: 6,
        marginLeft: 1,
        marginTop: 1,
    },

/*     valueRow:{
        fontSize: 6,
        margintOp: 5,
    }, */
    checkbox: {
        width: 10,
        height: 10,
        border: '0.5 solid black',
        marginRight: 5,
    },
    signature: {
        display: 'flex',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
    },
    paymentColumn: {
        flex: 1,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    checkedBox: {
        backgroundColor: 'black',
    },
    labelRow: {
        flexDirection: 'row',
        borderBottom: '0.5 solid black',
        paddingBottom: 2,
        marginBottom: 2,
    },

});

// Create Document Component
const GuestRegistrationCard = ({ guestData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Guest Registration Card</Text>

            <View style={styles.mainView}>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={[styles.column, { flex: 2, border: '0.5 solid black', padding: 5, borderWidth: 0.7 }]}>

                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Name:</Text>
                                    <Text style={styles.value}>{guestData.name}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Surname:</Text>
                                    <Text style={styles.value}>{guestData.surname}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>First Name:</Text>
                                    <Text style={styles.value}>{guestData.firstName}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Company:</Text>
                                    <Text style={styles.value}>{guestData.company}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Profession:</Text>
                                    <Text style={styles.value}>{guestData.profession}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Travel Agent:</Text>
                                    <Text style={styles.value}>{guestData.travelAgent}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Address:</Text>
                                    <Text style={styles.value}>{guestData.address}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>City:</Text>
                                    <Text style={styles.value}>{guestData.city}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Country:</Text>
                                    <Text style={styles.value}>{guestData.country}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>State:</Text>
                                    <Text style={styles.value}>{guestData.state}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Postal Code:</Text>
                                    <Text style={styles.value}>{guestData.postalCode}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>E-mail:</Text>
                                    <Text style={styles.value}>{guestData.email}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Phone/Fax:</Text>
                                    <Text style={styles.value}>{guestData.phone}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>Priority Club Number:</Text>
                                    <Text style={styles.value}>{guestData.priorityClubNumber}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.column, { flex: 1, border: '0.5 solid black', padding: 5, borderWidth: 0.7 }]}>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Passport No:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.passportNumber}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Date of Issue:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.passportDateOfIssue}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Date of Expiry:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.passportDateOfExpiry}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Place Of Issue:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.passportPlaceOfIssue}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Nationality:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.nationality}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Date of Birth:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.dateOfBirth}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>VISA/ CRG No:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.visaCrgNumber}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Date Of Issue:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.dateOfIssue}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Date Of Expiry:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.dateOfExpiry}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Place of Issue:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.placeOfIssue}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Arrived From:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.arrivedFrom}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Proceeding To:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.proceedingTo}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Arrival In India:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.arrivalInIndia}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Duration of stay:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.durationOfStay}</Text>
                                </View>
                            </View>
                            <View style={styles.labelRow}>
                                <View style={styles.labelColumn}>
                                    <Text style={styles.label}>Purp Of Visit:</Text>
                                </View>
                                <View style={styles.valueColumn}>
                                    <Text style={styles.value}>{guestData.purposeOfVisit}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={[styles.row, { border: '0.5 solid black', padding: 5, borderWidth: 0.7 }]}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Arrival Date:</Text>
                            <Text style={styles.value}>{guestData.arrivalDate}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Arrival Flight:</Text>
                            <Text style={styles.value}>{guestData.arrivalFlight}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>ETA:</Text>
                            <Text style={styles.value}>{guestData.eta}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Departure Date:</Text>
                            <Text style={styles.value}>{guestData.departureDate}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>ETD:</Text>
                            <Text style={styles.value}>{guestData.etd}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Drop Required:</Text>
                            <Text style={styles.value}>{guestData.dropRequired}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Departure Flight:</Text>
                            <Text style={styles.value}>{guestData.departureFlight}</Text>
                        </View>
                    </View>
                    <View style={[styles.row, { border: '0.5 solid black', padding: 5, borderWidth: 0.7 }]}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Room No. :</Text>
                            <Text style={styles.value}>{guestData.roomNo}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Room Type:</Text>
                            <Text style={styles.value}>{guestData.roomType}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Room Rate:</Text>
                            <Text style={styles.value}>{guestData.roomRate}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>No. of Guests:</Text>
                            <Text style={styles.value}>{guestData.noOfGuests}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Reservation No. :</Text>
                            <Text style={styles.value}>{guestData.reservationNo}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>No. of Rooms:</Text>
                            <Text style={styles.value}>{guestData.noOfRooms}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { border: '0.5 solid black', padding: 5, borderWidth: 0.7 }]}>
                    <Text style={styles.label}>Mode of Payment:</Text>
                    <View style={styles.row}>
                        <View style={styles.paymentColumn}>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.cash && styles.checkedBox]} />
                                <Text style={styles.value}>Cash</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.visaCard && styles.checkedBox]} />
                                <Text style={styles.value}>Visa Card</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.masterCard && styles.checkedBox]} />
                                <Text style={styles.value}>Master Card</Text>
                            </View>
                        </View>
                        <View style={styles.paymentColumn}>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.americanExpress && styles.checkedBox]} />
                                <Text style={styles.value}>American Express</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.dinersCard && styles.checkedBox]} />
                                <Text style={styles.value}>Diners Card</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.jcbCard && styles.checkedBox]} />
                                <Text style={styles.value}>JCB Card</Text>
                            </View>
                        </View>
                        <View style={styles.paymentColumn}>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.billsToCompany && styles.checkedBox]} />
                                <Text style={styles.value}>Bills to Company</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.voucher && styles.checkedBox]} />
                                <Text style={styles.value}>Voucher</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.foreignCurrency && styles.checkedBox]} />
                                <Text style={styles.value}>Foreign Currency</Text>
                            </View>
                        </View>
                        <View style={styles.paymentColumn}>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.travellersCheques && styles.checkedBox]} />
                                <Text style={styles.value}>Traveller's Cheques</Text>
                            </View>
                            <View style={styles.paymentRow}>
                                <View style={[styles.checkbox, guestData.paymentModes.others && styles.checkedBox]} />
                                <Text style={styles.value}>Others (please specify)</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Credit Card Number:</Text>
                        <Text style={styles.value}>{guestData.creditCardNumber}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Expiry:</Text>
                        <Text style={styles.value}>{guestData.creditCardExpiry}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>GST No:</Text>
                        <Text style={styles.value}>{guestData.gstNo}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.value}>Remark:</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.value}>Check-in time is 1400Hrs and Check-out time is 1200Hrs. Visitors are not permitted in guest room. The hotel is not responsible for the safety of any valuables left in the guest room. Safe deposit lockers are available free of charge in your room. All disputes are subject to the jurisdiction of Bengalauru Court Only.</Text>
                    <Text style={styles.value}>Foreigners other than Indian Nationals are required to pay their bill in convertible currency.</Text>
                    <Text style={styles.value}>All Food & Beverages served MUST be arranged through our In-Room Dining facility or at any of our restaurants. Food and Beverage from an outside vendor or catering company will not be permitted on our hotel premises.</Text>
                    <Text style={styles.value}>All rates mentioned above are exclusive of taxes. Any Government taxes would be charged extra.</Text>
                    <Text style={styles.value}>I agree to pay charges incurred by me during my stay in the hotel, and to settle my account once I have been billed for amounts up to Rs 50,000/- unless prior arrangements have been made.</Text>
                    <Text style={styles.value}>Any cash settlements above Rs 50,000/- are required to be supported with the copy of a valid PAN Card.</Text>
                </View>

                <View style={styles.signature}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Front Desk:</Text>
                        <Text style={styles.value}>_________________</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Duty Manager:</Text>
                        <Text style={styles.value}>_________________</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Ms. Ondhiya:</Text>
                        <Text style={styles.value}>_________________</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

export default GuestRegistrationCard;