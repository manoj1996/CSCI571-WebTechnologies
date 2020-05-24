package com.example.news_android;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.gson.Gson;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BookmarksFragment extends Fragment {
    private SharedPreferences preferences;
    private static final String SHARED_PREFS = "bookmarks";
    private RecyclerView bookmarkListView;
    private List<HomeNews> newsList = new ArrayList<HomeNews>();
    private BookmarkListAdapter adapter;
    private ProgressBar spinner;
    private TextView progressIndicator;
    private TextView noBookmark;
    @SuppressLint("CutPasteId")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.news_bookmark_fragment, container, false);
        preferences = getActivity().getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE);
        final SwipeRefreshLayout pullToRefresh = view.findViewById(R.id.pull_to_refresh_bookmark);
        pullToRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                refreshBookmark();
                pullToRefresh.setRefreshing(false);
            }
        });
        bookmarkListView = (RecyclerView) view.findViewById(R.id.news_bookmark_list);
        spinner = (ProgressBar) view.findViewById(R.id.progressBarBookmark);
        progressIndicator = (TextView) view.findViewById(R.id.progressIndicatorBookmark);
        noBookmark = (TextView) view.findViewById(R.id.no_bookmark);
        if(newsList.size() == 0){
            spinner.setVisibility(View.VISIBLE);
            progressIndicator.setVisibility(View.VISIBLE);
        }
        else{
            spinner.setVisibility(View.GONE);
            progressIndicator.setVisibility(View.GONE);
        }
        adapter = new BookmarkListAdapter(getActivity().getApplicationContext(), newsList, getActivity().getSupportFragmentManager());
        bookmarkListView.setLayoutManager(new GridLayoutManager(getActivity(), 2));
        bookmarkListView.addItemDecoration(new EqualSpacingItemDecoration(20, EqualSpacingItemDecoration.HORIZONTAL, getContext()));
        bookmarkListView.setAdapter(adapter);
        setBookmark();
        return view;
    }

    private void refreshBookmark(){
        spinner.setVisibility(View.VISIBLE);
        progressIndicator.setVisibility(View.VISIBLE);
        bookmarkListView.setVisibility(View.GONE);
        newsList.clear();
        setBookmark();
    }

    private void setBookmark(){
        Gson gson = new Gson();
        Map<String,?> keys = preferences.getAll();
        for(Map.Entry<String,?> entry : keys.entrySet()){
            String json = preferences.getString(entry.getKey(), "");
            HomeNews homeNews = gson.fromJson(json, HomeNews.class);
            newsList.add(homeNews);
        }
        if(newsList.size() == 0){
            noBookmark.setVisibility(View.VISIBLE);
        }
        else{
            noBookmark.setVisibility(View.GONE);
        }
        adapter.notifyDataSetChanged();
        spinner.setVisibility(View.GONE);
        progressIndicator.setVisibility(View.GONE);
        bookmarkListView.setVisibility(View.VISIBLE);
    }
    @Override
    public void onResume() {
        super.onResume();
        refreshBookmark();
    }
}
