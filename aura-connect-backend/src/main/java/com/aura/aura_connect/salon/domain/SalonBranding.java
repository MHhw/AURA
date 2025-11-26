package com.aura.aura_connect.salon.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "salon_branding")
public class SalonBranding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 14)
    private String primaryColor;

    @Column(nullable = false, length = 14)
    private String accentColor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SalonFrameStyle frameStyle;

    @Column(nullable = false, length = 30)
    private String backgroundTexture;

    @Column(length = 300)
    private String heroImageUrl;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "salon_id")
    private Salon salon;

    protected SalonBranding() {
        // for JPA
    }

    public SalonBranding(String primaryColor, String accentColor, SalonFrameStyle frameStyle, String backgroundTexture) {
        this.primaryColor = primaryColor;
        this.accentColor = accentColor;
        this.frameStyle = frameStyle;
        this.backgroundTexture = backgroundTexture;
    }

    public void attachSalon(Salon salon) {
        this.salon = salon;
    }

    public Long getId() {
        return id;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public SalonFrameStyle getFrameStyle() {
        return frameStyle;
    }

    public String getBackgroundTexture() {
        return backgroundTexture;
    }

    public String getHeroImageUrl() {
        return heroImageUrl;
    }

    public Salon getSalon() {
        return salon;
    }

    public void updateColors(String nextPrimaryColor, String nextAccentColor) {
        this.primaryColor = nextPrimaryColor;
        this.accentColor = nextAccentColor;
    }

    public void updateFrame(SalonFrameStyle nextFrameStyle, String nextBackgroundTexture) {
        this.frameStyle = nextFrameStyle;
        this.backgroundTexture = nextBackgroundTexture;
    }

    public void updateHeroImage(String heroImageUrl) {
        this.heroImageUrl = heroImageUrl;
    }
}
