package com.example.news_android;

import java.io.Serializable;

public class HomeNews implements Serializable {
    private String title, imageURL, Date, Section, id, url;
    public HomeNews() {
    }

    public HomeNews(String title, String imageURL, String Date, String Section,
                 String id, String url) {
        this.title = title;
        this.imageURL = imageURL;
        this.Date = Date;
        this.Section = Section;
        this.id = id;
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public String getDate() {
        return Date;
    }

    public void setDate(String year) {
        this.Date = Date;
    }

    public String getSection() {
        return Section;
    }

    public void setSection(String section) {
        this.Section = Section;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl(){
        return this.url;
    }

    public void setUrl(String url){
        this.url = url;
    }

}
