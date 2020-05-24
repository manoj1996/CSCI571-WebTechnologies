package com.example.news_android;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

public class TrendingFragment extends Fragment {
    private LineChart chart;
    private RequestQueue mQueue;
    private EditText searchTerm;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.trending_fragment, container, false);
        chart = (LineChart) view.findViewById(R.id.search_line_chart);
        searchTerm = (EditText) view.findViewById(R.id.search_term);
        searchTerm.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if(actionId == EditorInfo.IME_ACTION_DONE){
                    String q = searchTerm.getText().toString();
                    fetchDataAndPopulateChart(q);
                    return true;
                }
                return false;
            }
        });
        mQueue = Volley.newRequestQueue(getContext());
        fetchDataAndPopulateChart("Coronavirus");
        return view;
    }

    private void fetchDataAndPopulateChart(final String q){

        String url = "https://news-api-hw9.azurewebsites.net/guardian/trends?q="+q;
        final List<Entry> entries = new ArrayList<Entry>();
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                for (Iterator<String> it = response.keys(); it.hasNext(); ) {
                    String i = it.next();
                    try {
                        entries.add(new Entry(Float.parseFloat(i), Float.parseFloat(response.getString(i))));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                LineDataSet lineDataSet = new LineDataSet(entries, "Trending Chart for "+q);
                lineDataSet.setCircleColor(R.color.purple_chart);
                lineDataSet.setColor(R.color.purple_chart);
                LineData lineData = new LineData(lineDataSet);
                lineDataSet.setColor(R.color.purple_chart);
                lineDataSet.setCircleRadius(2.5f);
                lineDataSet.setFillColor(R.color.purple_chart);
                lineDataSet.setValueTextSize(7f);
                lineDataSet.setDrawCircleHole(false);
                chart.getAxisLeft().setDrawGridLines(false);
                chart.getAxisLeft().setDrawAxisLine(false);
                chart.getXAxis().setDrawGridLines(false);
                chart.getAxisRight().setDrawGridLines(false);
                chart.setData(lineData);
                chart.invalidate();
                Legend legend = chart.getLegend();
                legend.setTextSize(16f);
                chart.setVisibility(View.VISIBLE);
                InputMethodManager imm = (InputMethodManager) Objects.requireNonNull(getContext()).getSystemService(Activity.INPUT_METHOD_SERVICE);
                assert imm != null;
                imm.hideSoftInputFromWindow(searchTerm.getWindowToken(), 0);

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        mQueue.add(request);
    }
}
