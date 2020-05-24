package com.example.news_android;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class BookmarkListAdapter extends RecyclerView.Adapter<BookmarkListAdapter.ViewHolder> {
    FragmentManager fragmentManager;
    private LayoutInflater inflater;
    private SharedPreferences preferences;
    private static final String SHARED_PREFS = "bookmarks";
    private Context context;
    private List<HomeNews> homeNewsItems;
    private LongPressDialog longPressDialog;
    public BookmarkListAdapter(@NonNull Context context, @NonNull List<HomeNews> homeNewsItems, FragmentManager fragmentManager) {
        this.context = context;
        this.homeNewsItems = homeNewsItems;
        this.fragmentManager = fragmentManager;
        preferences = context.getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE);
    }

    @NonNull
    @Override
    public BookmarkListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        inflater = LayoutInflater.from(context);
        return new BookmarkListAdapter.ViewHolder(
                LayoutInflater
                        .from(context)
                        .inflate(R.layout.bookmark_row, parent, false)
        );
    }

    @Override
    public void onBindViewHolder(final BookmarkListAdapter.ViewHolder holder, int position) {
        final HomeNews m = homeNewsItems.get(position);
        ZoneId zoneIdNews = ZoneId.of("America/Los_Angeles");
        String convertedTime = ZonedDateTime.of(LocalDateTime.parse(m.getDate()), zoneIdNews).format(DateTimeFormatter.ofPattern("dd MMM"));
        Picasso.with(context).load(m.getImageURL()).resize(500, 500).centerInside().into(holder.imageView);
        holder.titleView.setText(m.getTitle());
        holder.date.setText(convertedTime);
        holder.section.setText(String.valueOf(m.getSection()));
        if(preferences.contains(m.getId())){
            holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_red_24dp);
        }
        else{
            holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_border_24dp);
        }
        holder.newsCardView.setClipToOutline(true);
        holder.newsCardView.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context.getApplicationContext(), DetailedNewsActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("id", m.getId());
                context.getApplicationContext().startActivity(intent);
            }
        });
        holder.bookmarkView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor editor = preferences.edit();
                if(preferences.contains(m.getId())){
                    editor.remove(m.getId());
                    holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_border_24dp);
                    Toast.makeText(context, "\""+m.getTitle()+"\" was removed from bookmarks", Toast.LENGTH_SHORT).show();
                    fragmentManager.beginTransaction().replace(R.id.fragment_container, new BookmarksFragment()).commit();
                }
                else{
                    Gson gson = new Gson();
                    editor.putString(m.getId(), gson.toJson(m));
                    holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_red_24dp);
                    Toast.makeText(context, "\""+m.getTitle()+"\" was added to bookmarks", Toast.LENGTH_SHORT).show();
                }
                editor.apply();
            }
        });

        holder.newsCardView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                openDialog(m.getId(), m.getImageURL(), m.getTitle(), m.getUrl(), m.getDate(), m.getSection());
                return true;
            }
        });
        longPressDialog = new LongPressDialog(m.getId(), m.getImageURL(), m.getTitle(), m.getUrl(), m.getDate(), m.getSection(), new LongPressDialog.ListAdapterListener() {
            @Override
            public void onBookmarkClick() {
                longPressDialog.dismiss();
                fragmentManager.beginTransaction().replace(R.id.fragment_container, new BookmarksFragment()).commit();
            }
        });

    }

    @Override
    public int getItemCount() {
        return this.homeNewsItems.size();
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        private RelativeLayout newsCardView;
        private ImageView imageView;
        private ImageView bookmarkView;
        private TextView titleView;
        private TextView date;
        private TextView section;
        @SuppressLint("CutPasteId")
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            this.imageView = (ImageView) itemView.findViewById(R.id.thumbnail_bookmark);
            this.bookmarkView = (ImageView) itemView.findViewById(R.id.news_bookmark_bookmark);
            this.titleView = (TextView) itemView.findViewById(R.id.title_bookmark);
            this.date = (TextView) itemView.findViewById(R.id.date_bookmark);
            this.section = (TextView) itemView.findViewById(R.id.section_bookmark);
            this.newsCardView = (RelativeLayout) itemView.findViewById(R.id.bookmark_news_card);
        }
    }

    public void openDialog(final String Id, String imageUrl, String title, String url, String date, String section){
        longPressDialog = new LongPressDialog(Id, imageUrl, title,url, date, section, new LongPressDialog.ListAdapterListener() {
            @Override
            public void onBookmarkClick() {
                longPressDialog.dismiss();
                fragmentManager.beginTransaction().replace(R.id.fragment_container, new BookmarksFragment()).commit();
            }
        });
        longPressDialog.show(this.fragmentManager, "news dialog");
    }
}
