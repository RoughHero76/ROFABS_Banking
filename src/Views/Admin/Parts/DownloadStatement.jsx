// src/Views/Admin/Parts/DownloadStatement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { Document, Page, Text, View, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ClipLoader, BeatLoader } from "react-spinners";
import sbiLogo from "../../../assets/sbiLogo.jpg";

const styles = StyleSheet.create({
    detailsTable: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 20,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    detailsHeading: {
        width: '20%',
        fontWeight: 'bold',
    },
    otherAddressDetails: {
        marginLeft: '37%',

    },
    detailsValue: {
        width: '80%',
    },
    comaa: {
        width: '2%',
    },
    page: {
        fontFamily: "Helvetica",
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
        lineHeight: 1.5,
        flexDirection: "column",
    },
    logo: {
        width: 120,
        height: 65,
        marginBottom: 20,
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 20,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        flexWrap: "wrap",
        width: "10%",
    },
    descriptionCol: {
        width: "30%",
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    descriptionCell: {
        fontSize: 7,
        flexWrap: "wrap",
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },

    refNoCol: {
        width: "10%",
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    refNoCell: {
        fontSize: 7,
        flexWrap: "wrap",
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    tableCell: {
        fontSize: 7,
        flexWrap: "wrap",
        overflowWrap: "break-word",
        wordBreak: 'break-word',
    },


    statmentDate: {
        marginTop: 20,
    }
});

const DownloadStatement = ({ startDate, endDate }) => {
    const [bankDetails, setBankDetails] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const splitLongWords = (text, maxLength = 10) => {
        return text.split(' ').map(word =>
            word.length > maxLength ? word.match(new RegExp(`.{1,${maxLength}}`, 'g')).join(' ') : word
        ).join(' ');
    };
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            let transactionsUrl = `${API_URL}/api/v1/admin/getTransactions`;
            if (startDate) {
                transactionsUrl += `?startDate=${startDate.toISOString()}`;
                if (endDate) {
                    transactionsUrl += `&endDate=${endDate.toISOString()}`;
                }
            }
            const [bankDetailsResponse, transactionsResponse] = await Promise.all([
                axios.get(`${API_URL}/api/v1/admin/getBankDetails`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(transactionsUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            setBankDetails(bankDetailsResponse.data[0]);
            setTransactions(transactionsResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = () => {
        const MyDocument = () => (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Image style={styles.logo} src={sbiLogo} />
                    {bankDetails && (
                        <>
                            <View style={styles.detailsTable}>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Account Name</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.accountName}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Address</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.address}</Text>

                                </View>
                                <View style={styles.detailsRow}>
                                    <View style={{ flexDirection: 'column' }}>

                                        <Text style={styles.otherAddressDetails}>{bankDetails.city}</Text>
                                        <Text style={styles.otherAddressDetails}>{bankDetails.state}</Text>
                                        <Text style={styles.otherAddressDetails}>{bankDetails.country}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Account Number</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.accountNumber}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Account Description</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.accountDescription}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Branch</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.branch}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Drawing Power</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.drawingPower}.00</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>Interest Rate (% p.a.)</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.interestRatePA}.0</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>MOD Balance</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.modBalance}.00</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>CIF No</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.cifNo}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>IFS Code</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.ifsCode}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.detailsHeading}>MICR Code</Text>
                                    <Text style={styles.comaa}>:</Text>
                                    <Text style={styles.detailsValue}>{bankDetails.micrCode}</Text>
                                </View>
                            </View>

                            <View style={styles.statmentDate}>
                                <Text>
                                    Account Statement from {
                                        startDate
                                            ? startDate.toISOString().split("T")[0]
                                            : "2024-04-19 "
                                    } to {
                                        endDate
                                            ? endDate.toISOString().split("T")[0]
                                            : new Date().toISOString().split("T")[0]
                                    }
                                </Text>
                            </View>
                        </>


                    )}

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Txn Date</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Value Date</Text>
                            </View>
                            <View style={[styles.tableCol, styles.descriptionCol]}>
                                <Text style={styles.tableCell}>Description</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Ref No</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Branch Code</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Debit</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Credit</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Balance</Text>
                            </View>
                        </View>
                        {transactions.map((transaction, index) => (
                            <View key={transaction._id} style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {new Date(transaction.TxnDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {new Date(transaction.ValueDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={[styles.tableCol, styles.descriptionCol]}>
                                    <Text style={styles.descriptionCell}>
                                        {splitLongWords(transaction.Description)}
                                    </Text>
                                </View>
                                <View style={[styles.tableCol, styles.refNoCol]}>
                                    <Text style={styles.refNoCell}>
                                        {splitLongWords(transaction.RefNo)}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{transaction.BranchCode}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{transaction.Debit}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{transaction.Credit}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{transaction.Balance}</Text>
                                </View>
                            </View>
                        ))}
                        <Text>**This is computer generated statement and does not require a signature.</Text>
                    </View>
                </Page>
            </Document>
        );

        return <MyDocument />;
    };

    const downloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const blob = await pdf(generatePDF()).toBlob();
            saveAs(blob, "statement.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            setError("Failed to generate PDF. Please try again later.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ClipLoader color="#36D7B7" size={50} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={fetchData} style={{ marginTop: '10px' }}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {isGeneratingPDF ? (
                <div>
                    <BeatLoader color="#36D7B7" size={15} />
                    <p>Generating PDF...</p>
                </div>
            ) : (
                <button
                    onClick={downloadPDF}
                    disabled={!bankDetails || transactions.length === 0}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: (!bankDetails || transactions.length === 0) ? '#ccc' : '#36D7B7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: (!bankDetails || transactions.length === 0) ? 'not-allowed' : 'pointer'
                    }}
                >
                    Download Statement
                    {startDate && ` (${startDate.toLocaleDateString()} - ${endDate ? endDate.toLocaleDateString() : startDate.toLocaleDateString()})`}
                </button>
            )}
            {(!bankDetails || transactions.length === 0) && (
                <p style={{ marginTop: '10px', color: '#666' }}>No data available to generate statement.</p>
            )}
        </div>
    );
};

export default DownloadStatement;