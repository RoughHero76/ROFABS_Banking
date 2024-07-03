// src/Views/Admin/Parts/DownloadStatement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../secrets";
import { Document, Page, Text, View, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ClipLoader, BeatLoader } from "react-spinners";
import sbiLogo from "../../../assets/sbiLogo.jpg";

const styles = StyleSheet.create({
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
        width: 100,
        height: 60,
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
    },
    tableCell: {
        fontSize: 7,
        flexWrap: "wrap",
        overflowWrap: "break-word",
        wordBreak: 'break-word',
    },

    statmentDate:{
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
                            <View>
                                <Text>Account Name : {bankDetails.accountName}</Text>
                                <Text>Address : {bankDetails.address}</Text>
                                <Text>Account Number : {bankDetails.accountNumber}</Text>
                                <Text>Account Description : {bankDetails.accountDescription}</Text>
                                <Text>Branch : {bankDetails.branch}</Text>
                                <Text>Drawing Power : {bankDetails.drawingPower}</Text>
                                <Text>Interest Rate (PA) : {bankDetails.interestRatePA}</Text>
                                <Text>MOD Balance : {bankDetails.modBalance}</Text>
                                <Text>CIF No : {bankDetails.cifNo}</Text>
                                <Text>IFS Code : {bankDetails.ifsCode}</Text>
                                <Text>MICR Code : {bankDetails.micrCode}</Text>
                            </View>
                            
                            <View style={styles.statmentDate}>
                                <Text>Account Statement from {startDate && startDate.toISOString().split("T")[0]} to {endDate && endDate.toISOString().split("T")[0]}</Text>
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
                                    <Text style={[styles.tableCell, { flexWrap: 'wrap' }]}>{transaction.Description}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{transaction.RefNo}</Text>
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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