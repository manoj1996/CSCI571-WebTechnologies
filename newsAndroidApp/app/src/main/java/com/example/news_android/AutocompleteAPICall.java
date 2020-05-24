package com.example.news_android;

import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.HashMap;
import java.util.Map;

public class AutocompleteAPICall {
    private static AutocompleteAPICall mInstance;
    private RequestQueue mRequestQueue;
    private static Context mCtx;
    public AutocompleteAPICall(Context ctx) {
        mCtx = ctx;
        mRequestQueue = getRequestQueue();
    }
    public static synchronized AutocompleteAPICall getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new AutocompleteAPICall(context);
        }
        return mInstance;
    }
    public RequestQueue getRequestQueue() {
        if (mRequestQueue == null) {
            mRequestQueue = Volley.newRequestQueue(mCtx.getApplicationContext());
        }
        return mRequestQueue;
    }
    public <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }
    public static void make(Context ctx, String query, Response.Listener<String>
            listener, Response.ErrorListener errorListener) {
        String url = "https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=" + query;
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                listener, errorListener) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Ocp-Apim-Subscription-Key", "124fa9fc366942818f9c941d57067990");
                return params;
            }
        };
        AutocompleteAPICall.getInstance(ctx).addToRequestQueue(stringRequest);
    }
}
