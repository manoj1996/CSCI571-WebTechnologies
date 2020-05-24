package com.example.news_android;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.squareup.picasso.Picasso;


public class CustomListAdapter extends RecyclerView.Adapter<CustomListAdapter.ViewHolder> {
    FragmentManager fragmentManager;
    private LayoutInflater inflater;
    private SharedPreferences preferences;
    private static final String SHARED_PREFS = "bookmarks";
    private Context context;
    private List<HomeNews> homeNewsItems;
    private Fragment currentFragment;
    private boolean isSectionNews;

    private ListAdapterListener mListener;

    public interface ListAdapterListener {
        void onBookmarkClick();
    }

    public CustomListAdapter(@NonNull Context context, @NonNull List<HomeNews> homeNewsItems, FragmentManager fragmentManager, ListAdapterListener listAdapterListener) {
        this.context = context;
        this.homeNewsItems = homeNewsItems;
        this.fragmentManager = fragmentManager;
        this.mListener = listAdapterListener;
        preferences = context.getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        inflater = LayoutInflater.from(context);
        return new ViewHolder(
                LayoutInflater
                        .from(context)
                        .inflate(R.layout.list_row, parent, false)
        );
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        final HomeNews m = homeNewsItems.get(position);
        Instant now = Instant.now();
        ZoneId zoneId = ZoneId.of("America/Los_Angeles");
        ZoneId zoneIdNews = ZoneId.of("UTC");
        ZonedDateTime dateAndTimeInLA = ZonedDateTime.ofInstant(now, zoneId);

        ZonedDateTime newsTime = ZonedDateTime.of(LocalDateTime.parse(m.getDate()), zoneIdNews);
        Duration duration = Duration.between(newsTime, dateAndTimeInLA);
        String s;
        int hours = (int) duration.toHours();
        int mins = (int) ((duration.getSeconds() % (60 * 60)) / 60);
        int secs = (int) (duration.getSeconds() % 60);
        if(hours >0)
        {
            if(hours>24)
            {
                s = (hours/24)+"d ago";
            }
            else
            {
                s = hours + "h ago";
            }
        }
        else if(mins>0)
        {
            s = mins+"m ago";
        }
        else
        {
            s = secs+"s ago";
        }

        Picasso.with(context).load(m.getImageURL()).resize(500, 500).centerInside().into(holder.imageView);
        holder.titleView.setText(m.getTitle());
        holder.date.setText(s);
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
        holder.newsCardView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                openDialog(m.getId(), m.getImageURL(), m.getTitle(), m.getUrl(), m.getDate(), m.getSection());
                return true;
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
                    mListener.onBookmarkClick();
                }
                else{
                    Gson gson = new Gson();
                    editor.putString(m.getId(),gson.toJson(m));
                    holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_red_24dp);
                    Toast.makeText(context, "\""+m.getTitle()+"\" was added to bookmarks", Toast.LENGTH_SHORT).show();
                    mListener.onBookmarkClick();
                }
                editor.apply();
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
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            this.imageView = (ImageView) itemView.findViewById(R.id.thumbnail);
            this.bookmarkView = (ImageView) itemView.findViewById(R.id.home_news_bookmark);
            this.titleView = (TextView) itemView.findViewById(R.id.title);
            this.date = (TextView) itemView.findViewById(R.id.date);
            this.section = (TextView) itemView.findViewById(R.id.section);
            this.newsCardView = (RelativeLayout) itemView.findViewById(R.id.news_card);
        }
    }

    public void openDialog(final String Id, String imageUrl, String Title, String url, String date, final String section){
        boolean isSet = false;
        if(preferences.contains(Id)){
            isSet = true;
        }
        final LongPressDialog longPressDialog = new LongPressDialog(Id, imageUrl, Title, url, date, section, new LongPressDialog.ListAdapterListener() {
            @Override
            public void onBookmarkClick() {
                mListener.onBookmarkClick();
            }
        });
        final boolean finalIsSet = isSet;
        longPressDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                boolean isSetAfterDismiss = false;
                if(preferences.contains(Id)){
                    isSetAfterDismiss = true;
                }
                if(finalIsSet != isSetAfterDismiss){
                    mListener.onBookmarkClick();
                }
            }
        });
        longPressDialog.show(this.fragmentManager, "news dialog");
    }

}
