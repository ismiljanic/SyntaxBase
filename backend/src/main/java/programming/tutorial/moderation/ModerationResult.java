package programming.tutorial.moderation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class ModerationResult {
    private String classical_label;
    private String bert_label;
    private Double bert_confidence;
    private String toxic_label;
    private Double toxic_confidence;
    private String final_label;
    private String llm_label;
    private String llm_reasoning;
    private List<String> pipeline;

    public ModerationResult() {
    }

    public ModerationResult(String classical_label, String bert_label, Double bert_confidence, String toxic_label, Double toxic_confidence, String final_label, String llm_label, String llm_reasoning, List<String> pipeline) {
        this.classical_label = classical_label;
        this.bert_label = bert_label;
        this.bert_confidence = bert_confidence;
        this.toxic_label = toxic_label;
        this.toxic_confidence = toxic_confidence;
        this.final_label = final_label;
        this.llm_label = llm_label;
        this.llm_reasoning = llm_reasoning;
        this.pipeline = pipeline;
    }

    public String getClassical_label() {
        return classical_label;
    }

    public void setClassical_label(String classical_label) {
        this.classical_label = classical_label;
    }

    public String getBert_label() {
        return bert_label;
    }

    public void setBert_label(String bert_label) {
        this.bert_label = bert_label;
    }

    public Double getBert_confidence() {
        return bert_confidence;
    }

    public void setBert_confidence(Double bert_confidence) {
        this.bert_confidence = bert_confidence;
    }

    public String getToxic_label() {
        return toxic_label;
    }

    public void setToxic_label(String toxic_label) {
        this.toxic_label = toxic_label;
    }

    public Double getToxic_confidence() {
        return toxic_confidence;
    }

    public void setToxic_confidence(Double toxic_confidence) {
        this.toxic_confidence = toxic_confidence;
    }

    public String getFinal_label() {
        return final_label;
    }

    public void setFinal_label(String final_label) {
        this.final_label = final_label;
    }

    public String getLlm_label() {
        return llm_label;
    }

    public void setLlm_label(String llm_label) {
        this.llm_label = llm_label;
    }

    public String getLlm_reasoning() {
        return llm_reasoning;
    }

    public void setLlm_reasoning(String llm_reasoning) {
        this.llm_reasoning = llm_reasoning;
    }

    public List<String> getPipeline() {
        return pipeline;
    }

    public void setPipeline(List<String> pipeline) {
        this.pipeline = pipeline;
    }
}

