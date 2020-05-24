package com.example.news_android;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class WorldNewsFragment extends Fragment {
    private RequestQueue mQueue;
    private RecyclerView homeListView;
    private List<HomeNews> newsList = new ArrayList<HomeNews>();
    private CustomListAdapter adapter;
    private ProgressBar spinner;
    private TextView progressIndicator;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.news_world_fragment, container, false);
        final SwipeRefreshLayout pullToRefresh = view.findViewById(R.id.home_pull_to_refresh);
        pullToRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                spinner.setVisibility(View.VISIBLE);
                progressIndicator.setVisibility(View.VISIBLE);
                homeListView.setVisibility(View.GONE);
                newsList.clear();
                setWorldNews();
                pullToRefresh.setRefreshing(false);
            }
        });
        homeListView = (RecyclerView) view.findViewById(R.id.news_world_list);
        spinner = (ProgressBar) view.findViewById(R.id.progressBarNews);
        progressIndicator = (TextView) view.findViewById(R.id.progressIndicatorNews);
        if(newsList.size() == 0){
            spinner.setVisibility(View.VISIBLE);
            progressIndicator.setVisibility(View.VISIBLE);
        }
        else{
            spinner.setVisibility(View.GONE);
            progressIndicator.setVisibility(View.GONE);
        }
        adapter = new CustomListAdapter(getActivity().getApplicationContext(), newsList, getActivity().getSupportFragmentManager(), new CustomListAdapter.ListAdapterListener() {
            @Override
            public void onBookmarkClick() {
                onResume();
            }
        });
        homeListView.setLayoutManager(new LinearLayoutManager(getContext()));
        homeListView.addItemDecoration(new EqualSpacingItemDecoration(30, EqualSpacingItemDecoration.VERTICAL, getContext()));
        homeListView.setAdapter(adapter);
        mQueue = Volley.newRequestQueue(getContext());
        setWorldNews();
        return view;
    }

    private void setWorldNews(){
        homeListView.setVisibility(View.GONE);
        String url = "https://news-api-hw9.azurewebsites.net/guardian/news?section=world";
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
                adapter.notifyDataSetChanged();
                spinner.setVisibility(View.GONE);
                progressIndicator.setVisibility(View.GONE);
                homeListView.setVisibility(View.VISIBLE);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        mQueue.add(request);
    }

    @Override
    public void onResume() {
        super.onResume();
        adapter.notifyDataSetChanged();
    }
}
