package com.example.news_android;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class NewsSearchResultsActivity extends AppCompatActivity {
    private ProgressBar spinner;
    private RequestQueue mQueue;
    private TextView progressIndicator;
    private RecyclerView recyclerView;
    private TextView searchResultsTitle;
    private List<HomeNews> newsList = new ArrayList<HomeNews>();
    private CustomListAdapter adapter;
    private String search;
    private TextView noSearchResults;
    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.search_results);
        final SwipeRefreshLayout pullToRefresh = findViewById(R.id.pull_to_refresh_results);
        pullToRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                spinner.setVisibility(View.VISIBLE);
                progressIndicator.setVisibility(View.VISIBLE);
                newsList.clear();
                recyclerView.setVisibility(View.GONE);
                displaySearchResults(search);
                pullToRefresh.setRefreshing(false);
            }
        });
        search = getIntent().getStringExtra("search");
        spinner = findViewById(R.id.progressBarNewsResults);
        progressIndicator = findViewById(R.id.progressIndicatorNewsResults);
        noSearchResults = findViewById(R.id.no_search_results);
        noSearchResults.setVisibility(View.GONE);
        spinner.setVisibility(View.VISIBLE);
        progressIndicator.setVisibility(View.VISIBLE);
        recyclerView = findViewById(R.id.news_search_results);
        mQueue = Volley.newRequestQueue(getApplicationContext());
        adapter = new CustomListAdapter(getApplicationContext(), newsList, getSupportFragmentManager(), new CustomListAdapter.ListAdapterListener() {
            @Override
            public void onBookmarkClick() {
                adapter.notifyDataSetChanged();
            }
        });
        recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
        recyclerView.addItemDecoration(new EqualSpacingItemDecoration(30, EqualSpacingItemDecoration.VERTICAL, getApplicationContext()));
        recyclerView.setAdapter(adapter);
        displaySearchResults(search);
        searchResultsTitle = findViewById(R.id.news_results_title);
        searchResultsTitle.setText("Search Results for "+search);
        findViewById(R.id.top_nav_bar_back_button_results).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    private void displaySearchResults(String search){
        String url = "https://news-api-hw9.azurewebsites.net/guardian/news/search?q="+search;
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                for (Iterator<String> it = response.keys(); it.hasNext(); ) {
                    String i = it.next();
                    try {
                        JSONObject news = (JSONObject) response.get(i);
                        System.out.println(news);
                        HomeNews homeNews = new HomeNews(news.getString("Title"), news.getString("Image"), news.getString("Date").split("Z")[0], news.getString("Section"), news.getString("id"), news.getString("url"));
                        newsList.add(homeNews);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                if(newsList.size() == 0){
                    noSearchResults.setVisibility(View.VISIBLE);
                }
                adapter.notifyDataSetChanged();
                spinner.setVisibility(View.GONE);
                progressIndicator.setVisibility(View.GONE);
                recyclerView.setVisibility(View.VISIBLE);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        mQueue.add(request);
    }


}
