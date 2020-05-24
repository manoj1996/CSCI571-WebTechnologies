package com.example.news_android;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.text.Html;
import android.text.SpannableString;
import android.text.style.UnderlineSpan;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;

public class DetailedNewsActivity extends AppCompatActivity {
    private ProgressBar spinner;
    private TextView progressIndicator;
    private ConstraintLayout detailedTitle;
    private RequestQueue mQueue;
    private SharedPreferences preferences;
    private ImageView bookmark;
    private static final String SHARED_PREFS = "bookmarks";
    @SuppressLint("WrongConstant")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.detailed_article);
        preferences = getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE);
        final String id = getIntent().getStringExtra("id");
        spinner = findViewById(R.id.progressBar);
        progressIndicator = findViewById(R.id.progressIndicator);
        bookmark = findViewById(R.id.detailed_bookmark);
        spinner.setVisibility(View.VISIBLE);
        progressIndicator.setVisibility(View.VISIBLE);
        detailedTitle = findViewById(R.id.detailed_article_top_bar);
        detailedTitle.setVisibility(View.GONE);
        mQueue = Volley.newRequestQueue(getApplicationContext());
        displayDetailedArticle(id);
    }

    private void displayDetailedArticle(final String id){
        String url = "https://news-api-hw9.azurewebsites.net/guardian/article?id="+id;
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(final JSONObject response) {
                TextView detailedBarTitle = findViewById(R.id.detailed_article_title);
                ImageView detailedImage = findViewById(R.id.detailed_image);
                detailedImage.setClipToOutline(true);
                TextView detailedArticleTitle = findViewById(R.id.detailed_title);
                TextView detailedSection = findViewById(R.id.detailed_section);
                TextView detailedDate = findViewById(R.id.detailed_date);
                TextView detailedText = findViewById(R.id.detailed_text);
                TextView detailedTextFullArticle = findViewById(R.id.detailed_view_full);
                try {
                    detailedBarTitle.setText(response.getString("Title"));
                    detailedArticleTitle.setText(response.getString("Title"));
                    Picasso.with(getApplicationContext()).load(response.getString("Image")).resize(500, 500).centerInside().into(detailedImage);
                    detailedSection.setText(response.getString("Section"));
                    String DateMM = response.getString("Date").split("Z")[0];
                    ZoneId zoneIdNews = ZoneId.of("America/Los_Angeles");
                    String convertedTime = ZonedDateTime.of(LocalDateTime.parse(DateMM), zoneIdNews).format(DateTimeFormatter.ofPattern("dd MMM YYYY"));
                    detailedDate.setText(convertedTime);
                    detailedText.setText(Html.fromHtml(response.getString("Description"), Html.FROM_HTML_MODE_LEGACY));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                ImageView backButton = (ImageView) findViewById(R.id.back_button);
                String viewFullArticle = "View Full Article";
                SpannableString content = new SpannableString(viewFullArticle);
                content.setSpan(new UnderlineSpan(), 0, viewFullArticle.length(), 0);
                detailedTextFullArticle.setText(content);
                backButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        finish();
                    }
                });
                detailedTextFullArticle.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View v) {
                        String url = null;
                        try {
                            url = response.getString("url");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        Intent i = new Intent(Intent.ACTION_VIEW);
                        i.setData(Uri.parse(url));
                        startActivity(i);
                    }
                });
                findViewById(R.id.detailed_twitter).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String url = null;
                        try {
                            url = "https://twitter.com/intent/tweet?hashtags=CSCI571NewsSearch&text=Check out this Link: "+response.getString("url");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        Intent i = new Intent(Intent.ACTION_VIEW);
                        i.setData(Uri.parse(url));
                        startActivity(i);
                    }
                });
                if(preferences.contains(id)){
                    bookmark.setImageResource(R.drawable.ic_bookmark_red_24dp);
                }
                else{
                    bookmark.setImageResource(R.drawable.ic_bookmark_border_24dp);
                }
                spinner.setVisibility(View.GONE);
                progressIndicator.setVisibility(View.GONE);
                detailedTitle.setVisibility(View.VISIBLE);
                bookmark.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        SharedPreferences.Editor editor = preferences.edit();
                        if(preferences.contains(id)){
                            editor.remove(id);
                            bookmark.setImageResource(R.drawable.ic_bookmark_border_24dp);
                            setResult(10001);
                            try {
                                Toast.makeText(getApplicationContext(), "\""+response.getString("Title")+"\" was removed from favourites", Toast.LENGTH_SHORT).show();
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        else{
                            Gson gson = new Gson();
                            try {
                                HomeNews homeNews = new HomeNews(response.getString("Title"),response.getString("Image"), response.getString("Date").split("Z")[0], response.getString("Section"),response.getString("id"), response.getString("url"));
                                editor.putString(id,gson.toJson(homeNews));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            bookmark.setImageResource(R.drawable.ic_bookmark_red_24dp);
                            setResult(10001);
                            try {
                                Toast.makeText(getApplicationContext(), "\""+response.getString("Title")+"\" was added to favourites", Toast.LENGTH_SHORT).show();
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        editor.apply();
                    }
                });

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        mQueue.add(request);
    }
}
