package com.example.news_android;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.location.Address;
import android.location.Criteria;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.RoundedBitmapDrawable;
import androidx.core.graphics.drawable.RoundedBitmapDrawableFactory;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
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
import java.util.Locale;
import java.util.Objects;

import static androidx.recyclerview.widget.RecyclerView.HORIZONTAL;

public class HeadlinesFragment extends Fragment {
    private RequestQueue mQueue;
    private RecyclerView homeListView;
    private List<HomeNews> newsList = new ArrayList<HomeNews>();
    private CustomListAdapter adapter;
    private static final String SHARED_PREFS = "bookmarks";
    private ProgressBar spinner;
    private TextView progressIndicator;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.headlines_fragment, container, false);
        final SwipeRefreshLayout pullToRefresh = view.findViewById(R.id.home_pull_to_refresh);
        pullToRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                spinner.setVisibility(View.VISIBLE);
                progressIndicator.setVisibility(View.VISIBLE);
                homeListView.setVisibility(View.GONE);
                boolean permissionGranted = ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;

                if(permissionGranted) {
                    try {
                        setWeatherCard();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 200);
                }
                newsList.clear();
                setTop10News();
                pullToRefresh.setRefreshing(false);
            }
        });
        homeListView = (RecyclerView) view.findViewById(R.id.home_top_10_news);
        spinner = (ProgressBar) getActivity().findViewById(R.id.progressBar);
        progressIndicator = (TextView) getActivity().findViewById(R.id.progressIndicator);
        spinner.setVisibility(View.VISIBLE);
        progressIndicator.setVisibility(View.VISIBLE);
        adapter = new CustomListAdapter(getActivity().getApplicationContext(), newsList, getActivity().getSupportFragmentManager(), new CustomListAdapter.ListAdapterListener() {
            @Override
            public void onBookmarkClick() {
                adapter.notifyDataSetChanged();
            }
        });
        homeListView.setLayoutManager(new LinearLayoutManager(getContext()));
        homeListView.setAdapter(adapter);
        Drawable mDivider = ContextCompat.getDrawable(getContext(), R.drawable.list_divider);
        DividerItemDecoration hItemDecoration = new DividerItemDecoration(getContext(), DividerItemDecoration.HORIZONTAL);
        hItemDecoration.setDrawable(mDivider);
        homeListView.addItemDecoration(hItemDecoration);
        homeListView.addItemDecoration(new EqualSpacingItemDecoration(30, EqualSpacingItemDecoration.VERTICAL, getContext()));
        mQueue = Volley.newRequestQueue(getContext());
        boolean permissionGranted = ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        if(permissionGranted) {
            try {
                setWeatherCard();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 200);
        }

        setTop10News();
        return view;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


    }

    @SuppressLint("MissingPermission")
    private Location getLastKnownLocation(LocationManager lm) {
        List<String> providers = lm.getProviders(true);
        Location bestLocation = null;
        for (String provider : providers) {
            Location l = lm.getLastKnownLocation(provider);
            if (l == null) {
                continue;
            }
            if (bestLocation == null || l.getAccuracy() < bestLocation.getAccuracy()) {
                bestLocation = l;
            }
        }
        return bestLocation;
    }


    private void setWeatherCard() throws IOException {
        Location location;
        LocationManager lm = (LocationManager) Objects.requireNonNull(getActivity()).getSystemService(Context.LOCATION_SERVICE);
        location = getLastKnownLocation(lm);
        double longitude = location.getLongitude();
        double latitude = location.getLatitude();
        Geocoder geocoder = new Geocoder(getContext(), Locale.getDefault());
        List<Address> addresses = geocoder.getFromLocation(latitude, longitude, 1);
        final String cityName = addresses.get(0).getLocality();
        final String stateName = addresses.get(0).getAdminArea();
        String url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=metric&appid=fdf2b8aab7f360eeb2e4fdf53bc3549a";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    TextView cityView = (TextView) getActivity().findViewById(R.id.weather_city_name);
                    cityView.setText(cityName);
                    TextView stateView = (TextView) getActivity().findViewById(R.id.weather_state_name);
                    stateView.setText(stateName);
                    double temp = response.getJSONObject("main").getDouble("temp");
                    String summary = response.getJSONArray("weather").getJSONObject(0).getString("main");
                    TextView tempView = (TextView) getActivity().findViewById(R.id.weather_temp);
                    tempView.setText(Integer.toString((int)temp).concat(String.valueOf((char) 0x00B0).concat("C")));
                    TextView summaryView = (TextView) getActivity().findViewById(R.id.weather_summary);
                    summaryView.setText(summary);
                    ImageView backgroundImage = (ImageView) getActivity().findViewById(R.id.weather_background_image);
                    Bitmap batmapBitmap;
                    switch (summary.toLowerCase()){
                        case "clouds":
                            batmapBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.cloudy_weather);
                            break;
                        case "clear":
                            batmapBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.clear_weather);
                            break;
                        case "snow":
                            batmapBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.snowy_weather);
                            break;
                        case "rain":
                        case "drizzle":
                            batmapBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.rainy_weather);
                            break;
                        case "thunderstorm":
                            batmapBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.thunder_weather);
                            break;
                        default:
                            batmapBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.sunny_weather);
                    }
                    RoundedBitmapDrawable circularBitmapDrawable = RoundedBitmapDrawableFactory.create(getResources(), batmapBitmap);
                    circularBitmapDrawable.setCornerRadius(25);
                    backgroundImage.setImageDrawable(circularBitmapDrawable);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });

        mQueue.add(request);


    }

    private void setTop10News(){
        String url = "https://news-api-hw9.azurewebsites.net/guardian/10Latest";
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
