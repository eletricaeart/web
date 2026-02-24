import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Registro de fontes (opcional, mas deixa o orçamento profissional)
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#1e293b",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#1a237e", // Azul Sodalita
    paddingBottom: 20,
    marginBottom: 20,
  },
  logo: { width: 120 },
  docInfo: { textAlign: "right" },
  titleSection: {
    backgroundColor: "#1a237e",
    padding: 10,
    color: "#FFFFFF",
    marginBottom: 20,
    borderRadius: 4,
  },
  subtitle: { fontSize: 10, opacity: 0.8 },
  mainTitle: { fontSize: 16, fontWeight: 700, marginTop: 4 },

  section: { marginBottom: 15 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a237e",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  clientBox: {
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    marginBottom: 20,
  },
  clause: { marginBottom: 12 },
  clauseTitle: { fontWeight: 700, marginBottom: 4 },
  clauseContent: { lineHeight: 1.5, color: "#334155" },

  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureLine: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#000",
    textAlign: "center",
    paddingTop: 5,
  },
});

export const BudgetPDFTemplate = ({ data }) => (
  <Document title={`Orçamento - ${data?.cliente?.name}`}>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 700, color: "#1a237e" }}>
            ELÉTRICA & ART
          </Text>
          <Text>Engenharia e Automação Residencial</Text>
        </View>
        <View style={styles.docInfo}>
          <Text>Emissão: {data?.docTitle?.emissao}</Text>
          <Text>Validade: {data?.docTitle?.validade}</Text>
        </View>
      </View>

      {/* Título */}
      <View style={styles.titleSection}>
        <Text style={styles.subtitle}>{data?.docTitle?.subtitle}</Text>
        <Text style={styles.mainTitle}>{data?.docTitle?.text}</Text>
      </View>

      {/* Dados do Cliente */}
      <View style={styles.clientBox}>
        <Text style={{ fontWeight: 700 }}>CLIENTE:</Text>
        <Text>{data?.cliente?.name}</Text>
        <Text>{`${data?.cliente?.rua}, ${data?.cliente?.num} - ${data?.cliente?.bairro}`}</Text>
        <Text>{`${data?.cliente?.cidade} - CEP: ${data?.cliente?.cep}`}</Text>
      </View>

      {/* Serviços/Cláusulas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escopo dos Serviços</Text>
        {data?.servicos?.map((servico, idx) => (
          <View key={idx} style={styles.clause} wrap={false}>
            <Text style={styles.clauseTitle}>
              {idx + 1}. {servico.titulo}
            </Text>
            {servico.itens.map((item, iIdx) => (
              <View key={iIdx} style={{ marginLeft: 10, marginTop: 5 }}>
                <Text style={{ fontWeight: 700 }}>{item.subtitulo}</Text>
                {/* Aqui simplificamos o markdown para texto puro no PDF */}
                <Text style={styles.clauseContent}>
                  {item.detalhes.map((d) => d.conteudo).join(" ")}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Assinaturas */}
      <View style={styles.signatureRow}>
        <View style={styles.signatureLine}>
          <Text>Rafael - Elétrica & Art</Text>
        </View>
        <View style={styles.signatureLine}>
          <Text>Assinatura do Cliente</Text>
        </View>
      </View>
    </Page>
  </Document>
);
