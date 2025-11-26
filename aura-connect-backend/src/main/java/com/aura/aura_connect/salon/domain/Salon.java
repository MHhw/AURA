package com.aura.aura_connect.salon.domain;

import com.aura.aura_connect.user.domain.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salons")
public class Salon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 300)
    private String description;

    @Column(nullable = false, length = 180)
    private String address;

    @Column(nullable = false, length = 60)
    private String city;

    @Column(length = 30)
    private String contactNumber;

    @Column(length = 300)
    private String heroImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToOne(mappedBy = "salon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private SalonBranding branding;

    @OneToMany(mappedBy = "salon", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<SalonMenuItem> menuItems = new ArrayList<>();

    protected Salon() {
        // for JPA
    }

    public Salon(String code, String name, String description, String address, String city, String contactNumber,
                 String heroImageUrl, User owner) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.address = address;
        this.city = city;
        this.contactNumber = contactNumber;
        this.heroImageUrl = heroImageUrl;
        this.owner = owner;
    }

    public void attachBranding(SalonBranding branding) {
        this.branding = branding;
        branding.attachSalon(this);
    }

    public void addMenuItem(SalonMenuItem menuItem) {
        menuItem.assignSalon(this);
        this.menuItems.add(menuItem);
    }

    public void updateOwner(User owner) {
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getHeroImageUrl() {
        return heroImageUrl;
    }

    public User getOwner() {
        return owner;
    }

    public SalonBranding getBranding() {
        return branding;
    }

    public List<SalonMenuItem> getMenuItems() {
        return menuItems;
    }
}
