package com.example.news_android;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.Image;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import org.json.JSONException;

public class LongPressDialog extends AppCompatDialogFragment {
    private ImageView dialogImage;
    private TextView dialogTitle;
    private String Id;
    private String imageUrl;
    private String title;
    private String url;
    private String date;
    private String section;
    private DialogInterface.OnDismissListener onDismissListener;
    private static final String SHARED_PREFS = "bookmarks";
    private SharedPreferences preferences;
    private ListAdapterListener mListener;

    public interface ListAdapterListener {
        void onBookmarkClick();
    }
    public LongPressDialog(String id, String imageUrl, String title, String url, String date, String section, ListAdapterListener listAdapterListener){
        this.Id = id;
        this.imageUrl = imageUrl;
        this.title = title;
        this.url = url;
        this.date = date;
        this.section = section;
        this.mListener = listAdapterListener;
    }
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();
        preferences = getContext().getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE);
        final View view = inflater.inflate(R.layout.long_press_dialog_box, null);
        dialogTitle = (TextView) view.findViewById(R.id.news_dialog_title);
        dialogTitle.setText(this.title);
        dialogImage = (ImageView) view.findViewById(R.id.news_dialog_image);
        ImageView dialogTwitter = view.findViewById(R.id.twitter_dialog);
        final ImageView dialogBookmark = view.findViewById(R.id.bookmark_dialog);
        Picasso.with(getContext()).load(this.imageUrl).resize(250, 160).centerInside().into(dialogImage);
        dialogTwitter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String urlTwitter = "https://twitter.com/intent/tweet?hashtags=CSCI571NewsSearch&text=Check out this Link: "+url;
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setData(Uri.parse(urlTwitter));
                startActivity(i);
            }
        });
        if(preferences.contains(Id)){
            dialogBookmark.setImageResource(R.drawable.ic_bookmark_red_24dp);
        }
        else{
            dialogBookmark.setImageResource(R.drawable.ic_bookmark_border_24dp);
        }
        builder.setView(view);
        dialogBookmark.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor editor = preferences.edit();
                if(preferences.contains(Id)){
                    dialogBookmark.setImageResource(R.drawable.ic_bookmark_border_24dp);
                    editor.remove(Id);
                    Toast.makeText(getContext(), "\""+title+"\" was removed from bookmarks", Toast.LENGTH_SHORT).show();
                    mListener.onBookmarkClick();
                }
                else{
                    Gson gson = new Gson();
                    HomeNews homeNews = new HomeNews(title, imageUrl, date, section,Id, url);
                    dialogBookmark.setImageResource(R.drawable.ic_bookmark_red_24dp);
                    editor.putString(Id, gson.toJson(homeNews));
                    Toast.makeText(getContext(), "\""+title+"\" was added to bookmarks", Toast.LENGTH_SHORT).show();
                    mListener.onBookmarkClick();
                }
                editor.apply();
            }
        });
        return builder.create();
    }

    public void setOnDismissListener(DialogInterface.OnDismissListener onDismissListener) {
        this.onDismissListener = onDismissListener;
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        super.onDismiss(dialog);
        if (onDismissListener != null) {
            onDismissListener.onDismiss(dialog);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        ViewGroup.LayoutParams params = getDialog().getWindow().getAttributes();
        float factor = getContext().getResources().getDisplayMetrics().density;
        params.width = (int)(295 * factor);
        getDialog().getWindow().setAttributes((android.view.WindowManager.LayoutParams) params);
    }
}
